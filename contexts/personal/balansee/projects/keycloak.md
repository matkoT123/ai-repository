# Keycloak, audit listener and infra repo

## Keycloak (prod)
- Keycloak 26.1.x at `auth.balansee.sk`, realm **`Balansee`**. Watchtower disabled for it; image upgrades are manual and must be checked against the listener SPI version.
- Clients: `balansee-frontend` (public, FE login), `balansee-backend`, `balansee-service` (confidential, client credentials; used by backend admin ops, ai-module, listener, and as the `azp` for all `/internal/**` calls). Secrets only in prod `.env` (`KEYCLOAK_BACKEND_CLIENT_SECRET`, `KEYCLOAK_SERVICE_CLIENT_SECRET`).
- No client roles (removed 2026-08-18). Jakub added a `balansee-admin` client and realm role `admin` for runtime admin settings, which were later dropped again; check before relying on it.
- 2FA: Keycloak-native TOTP via backend `/2fa` endpoints.
- `eventsEnabled=false` on purpose (trail lives in audit-module); `eventsListeners = ["balansee-audit","jboss-logging"]`, `adminEventsEnabled=true`, details off.
- Realm SMTP = `info@twincode.sk`; update together with ntf `MAIL_PASSWORD`.
- Brute force protection and password policy are still off (audit V2, user task).
- Master realm `admin` uses the user's personal gmail; never delete it in purges.
- After realm re-import client secrets come back masked; run `keycloak-init.sh` (`infra.md`).
- Admin API recipe for fake test users: `PUT /admin/realms/Balansee/users/{id}` with `{"emailVerified":true,"requiredActions":[]}` using a `balansee-service` token.

## keycloak-audit-listener
Event Listener SPI that forwards auth and admin events to audit-module as `sourceModule=KEYCLOAK` (the FE authenticates directly against Keycloak, so the backend never sees logins).

- Path `C:/SZABOPROJECTS/Balansee-be/keycloak-audit-listener`, origin `gitlab.com/balansee/backend/balansee-keycloak-audit` (repo, folder and artifactId all differ). No CI image; `target/` gitignored.
- Memory: backend memory `project_keycloak_audit_listener_pending.md`.
- Stack: Java 17, Keycloak SPI 26.1.0, Maven. Build `mvn -B package -DskipTests`.
- Deploy (state-changing, user's go): copy the JAR to `/opt/Balansee-INFRA/data/docker/keycloak/providers/keycloak-audit-listener.jar`, `docker compose up -d keycloak` (about 50 s login outage). Keycloak runs `start` without `--optimized`, so it rebuilds at start. Rollback: remove the JAR and restart. The 2026-10-07 security fix (`c5f56f6`) was **not** deployed yet.
- Env in the keycloak block: `BALANSEE_AUDIT_URL`, `BALANSEE_AUDIT_TOKEN_URL`, `BALANSEE_AUDIT_CLIENT_ID`, `BALANSEE_AUDIT_CLIENT_SECRET`.
- `CLIENT_LOGIN` is never audited (the listener's own token fetch would loop). Admin event representations are never sent (may contain passwords or secrets). `WARN KC-SERVICES0047` at start is expected.

## Infra repo
`gitlab.com/balansee/balansee-infra`, working copy on the server. Push procedure and CRLF trap: `infra.md` > Infra repo. `C:/SZABOPROJECTS/Balansee-KEYCLOAK` is the outdated predecessor; do not use it.
