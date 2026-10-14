# Balansee infrastructure

Single production server; there is no separate staging. It still runs as dev/staging without real customer data until the Tink contract and a real launch.

## Server
- SSH alias **`balansee-prod-new`** (`~/.ssh/config`, user root, key file referenced there; never read key files). Hetzner Cloud, Ubuntu, Docker + Compose v5.
- The old host (alias `balansee-server`, user `claude-agent`) is decommissioned. Never connect to it. A "REMOTE HOST IDENTIFICATION HAS CHANGED" warning on that alias means the IP was reassigned, not MITM.
- Stack dir: **`/opt/Balansee-INFRA`** (git working copy of `balansee-infra`; WinSCP session "Balansee-prod"). Contains `compose.yaml`, `.env` (all secrets), `data/docker/sql/000-init.sql`, Keycloak realm export, login theme `balansee`, `data/docker/keycloak/providers/` (listener JAR), `qdrant_storage/`, `letsencrypt/`.
- Protection: Hetzner Cloud Firewall only (ufw inactive). Postgres is published `5432:5432` but blocked externally by that firewall. Disk not encrypted, no backups (both deliberately deferred to real launch, BSEE-93). One manual dump exists from the 2026-10-07 wipe under `/root/backups/`.
- Live diagnostics: `/server-check` skill (`plugins/personal-skills/skills/server-check`).

## Operating policy on the server
- Read-only diagnostics (docker ps/logs/inspect, env presence checks, reading files, `SELECT` via `docker exec ... psql`) without asking.
- Anything state-changing (`docker compose up -d`, restart, `--force-recreate`, `prune`, `down`, volume ops, editing `compose.yaml`/`.env`, DDL/DML) only after showing the exact command and getting the user's go. The permission classifier blocks direct writes to prod compose; the user then applies the edit himself.
- Never print env values. Check presence with `docker exec <c> printenv NAME >/dev/null && echo set` or `sh -c '[ -n "$NAME" ] && echo set'`.
- Remote heredoc trap: `ssh host "psql ... << 'SQL' ... SQL"` silently does nothing (the heredoc is consumed locally). Use several `psql -c "..."` flags and always verify the effect (e.g. `pg_get_constraintdef(oid)`), not just a zero exit.

## Containers (compose project `balansee`, names `balansee-<service>-1`, network `balansee_default`)
| Service | Host / port | Watchtower | Notes |
|---|---|---|---|
| traefik v2.11 | 80/443, Let's Encrypt (`myresolver`) | no | Dashboard was public at `traefik.balansee.sk` (audit V1 area) |
| backend | `api.balansee.sk`, 8080, context path `/balansee` | yes | profile `dev`; start about 40-90 s |
| ai-module | `ai.balansee.sk`, 8081 | yes | needs `BACKEND_BASE_URL=http://backend:8080/balansee` |
| ntf-module | `ntf.balansee.sk`, 8082 | yes | |
| audit-module | internal `audit-module:8083` | yes | only `/internal/*` |
| frontend | `balansee.sk`, 4000 (Node SSR) | yes | |
| keycloak 26.1.x | `auth.balansee.sk`, internal `keycloak:8080` | **no** | realm `Balansee`; start about 50 s, login down meanwhile |
| postgres 16 | internal `postgres:5432` | no | |
| qdrant v1.9 | internal `qdrant:6333`/`6334` | no | was public at `qdrant.balansee.sk` without API key (audit) |
| portainer | `portainer.balansee.sk` | no | public route still open (audit V1) |
| watchtower | - | - | `--interval 300`, label-enabled |

Check the current `compose.yaml` before relying on the host list; the audit fixes for Qdrant/Traefik/internal routes were left to the user.

## Databases (one Postgres container)
`keycloak`, `balansee` (backend), `balansee_ai`, `balansee_ntf`, `balansee_audit`, all with `unaccent`. Total about 100 MB. Access: `docker exec balansee-postgres-1 psql -U postgres -d <db> -c "..."`. Qdrant collections: `transactions` (categorization vectors, owner = Keycloak id) and the RAG knowledge base (0 points as of 2026-10-07).

On 2026-10-07 all user data was wiped for a clean testing start (all four app DBs, Keycloak realm users except the service account, Qdrant points). Flyway history, notification templates and a few unused registration codes were kept.

## Deploy
Normal path: push to `main` > CI image > watchtower (`rules/git.md` > CI and deploy). Manual cases:
- env var or compose change: `cd /opt/Balansee-INFRA && docker compose up -d <service>`, then verify env presence with `docker inspect`.
- new service: the first `docker compose up -d <service>` is manual; watchtower only updates existing containers.
- Keycloak listener JAR: `projects/keycloak.md`.
- After a deploy that touches entities or enums, check the schema in Postgres (`information_schema.columns`, constraint defs) and `RestartCount`, not only the last "Started" log line.

## Verify on prod, not locally
Runtime verification happens only on prod after deploy, e.g. calling internal endpoints with a service token from inside the network: `docker run --rm --network balansee_default curlimages/curl ...`, plus `docker logs` and DB queries. Service token comes from the `balansee-service` client (secret in prod `.env`: `KEYCLOAK_SERVICE_CLIENT_SECRET`); never echo the token. If a change needs verification before push and unit tests are not enough, say so instead of starting a local stack.

## Infra repo (`balansee-infra`)
- No local Windows clone; edits happen on the server and are committed there. `.env`, `letsencrypt/`, `qdrant_storage/`, `providers/*.jar` are deliberately not in git (`.gitkeep` in providers).
- No git credentials on the server. The only GitLab credential is the registry PAT in `/root/.docker/config.json` (scopes include `write_repository` and `api`, expires 2026-11-19). Push procedure (after the user's go): create a temp `GIT_ASKPASS` script that reads the PAT from that file, `git push origin main`, delete the script immediately. Never write it to `.git/config`, `.git-credentials` or a command line that gets logged.
- No `.gitattributes`: files copied from Windows via scp arrive with CRLF and show as full-file rewrites. Check with `diff --strip-trailing-cr`, normalize with `sed -i 's/\r$//'` before committing.
- Keycloak partial export masks secrets as `**********` (client secrets, SMTP password). After a realm re-import run `keycloak-init.sh` (`source .env && ./keycloak-init.sh`); automating it via a healthcheck plus one-shot init service was proposed, never applied.
- `C:/SZABOPROJECTS/Balansee-KEYCLOAK` is an outdated local copy with an old remote and old image names. Do not deploy or push from it.

## Security
Never copy any value. Paths only.

**Files holding exposed secret values (clean up or rotate):**
1. `C:/SZABOPROJECTS/Balansee-be/Balansee-be/.claude/settings.local.json` - prod DB password in allow rules (old host), Confluence API token in an `export` rule.
2. `C:/SZABOPROJECTS/Balansee-be/ai-module/.claude/settings.local.json` - matches secret patterns, review.
3. `C:/SZABOPROJECTS/Balansee-be/Balansee-be/claude-materials/conversation_log.md` - matches secret patterns (gitignored, but @imported by the repo `CLAUDE.md`).
4. `C:/SZABOPROJECTS/Balansee-KEYCLOAK/.git/config` - token embedded in the remote URL; that repo also tracks `.env` in git.
5. Memory `C--SZABOPROJECTS-Balansee-be-Balansee-be/memory/project_db_encryption.md` - contains the `ENCRYPTION_KEY` value.
6. Memory `C--SZABOPROJECTS-Balansee-be-ai-module/memory/project_infra.md` - contains the Keycloak DB password from the init SQL.
7. Memory `.../Balansee-be/memory/project_testing_phase.md` - test account password pattern and registration codes.
8. Server `/root/.docker/config.json` - registry PAT with full `api` scope in a readable file.

**Open rotations and hardening (on the user, from `project_security_audit_2026_10.md`, report in `Balansee-be/claude-materials/analyza_kodu/`):**
- K4: rotate keys that are in Balansee-be git history up to `46b1c51`: OpenAI, Tink, Yapily, Keycloak `balansee-service` secret. New values into prod `.env`, then `docker compose up -d` for affected services. Optional history cleanup (filter-repo + force push, needs protected-branch change).
- OpenAI key also leaked into a conversation in 2026-07 (old server-check redaction bug); rotation never confirmed. Set a monthly limit in the OpenAI dashboard.
- V2: Keycloak realm `Balansee`: enable brute force detection and a password policy, IP-allowlist the admin console, consider disabling direct access grants for `balansee-frontend`.
- V1: Portainer public route: remove or IP-allowlist.
- V3: close `/registration-code/generate` (and stop returning the ADMIN code) before launch; open on purpose for the FE dev screen `/dev/registration-codes`.
- S1: separate Keycloak clients for ai-module and the listener instead of shared `balansee-service`.
- Replace the server registry PAT with a `read_registry` deploy token (expires 2026-11-19 anyway).
- Confluence token: the one in settings.local.json is exposed; revoke and create a new one.
- `ENCRYPTION_KEY`: rotating it needs a re-encryption migration once `bank_connection` has rows; losing it makes stored bank tokens undecryptable. Keep it in a password manager.
- Keycloak `admin` in the master realm shares the user's personal gmail; never delete it during user purges.
