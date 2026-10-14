# Personal project: Balansee

Loaded from `C:/SZABOPROJECTS` and `G:/personal-projects/szabo`. Adds to the personal layer (`../CLAUDE.md`) and `core/`. Balansee is a personal finance app (bank aggregation via Tink/Yapily, AI categorization and chat, goals, monthly plans, financial academy). Co-founded by the user and Jakub (Kubo) Szabo under their company twincode.sk. Currently in the testing phase (since 2026-10-07): web first, mobile later.

@rules/git.md
@infra.md
@integrations.md

People and roles: `team.md`. Stale dated memory files: `archive/README.md`. Unresolved decisions: `open-questions.md`.

## Repos
Read the matching project file when work starts on a repo. Each links to its memory dir for current status.

| File | Repo | Local path | GitLab |
|---|---|---|---|
| `projects/backend.md` | Main backend (Spring Boot) | `C:/SZABOPROJECTS/Balansee-be/Balansee-be` | `balansee/backend/balansee-be` |
| `projects/ai-module.md` | AI service: categorization, chat, statement extraction | `C:/SZABOPROJECTS/Balansee-be/ai-module` | `balansee/backend/balansee-ai` |
| `projects/notification.md` | Notifications: web inbox, email, push, SMS | `C:/SZABOPROJECTS/Balansee-be/notification-module` | `balansee/backend/balansee-ntf` |
| `projects/audit.md` | Audit trail service | `C:/SZABOPROJECTS/Balansee-be/balansee-audit` | `balansee/backend/balansee-audit` |
| `projects/keycloak.md` | Keycloak realm, audit listener SPI, infra repo | `C:/SZABOPROJECTS/Balansee-be/keycloak-audit-listener`, server `/opt/Balansee-INFRA` | `balansee/backend/balansee-keycloak-audit`, `balansee/balansee-infra` |
| `projects/frontend.md` | Angular 19 web (Jakub's repo) | `G:/personal-projects/szabo/Balansee-FE` | `balansee/balansee-fe` |

`C:/SZABOPROJECTS/Balansee-KEYCLOAK` is the old infra copy, superseded by `balansee-infra`. Do not use it (see `infra.md`).

## Project-wide rules
- Existing Balansee code style matches core: Lombok classes, no records, `var`, thin controllers, MapStruct for DTO mapping (`core/rules/code-style.md`, `core/rules/architecture.md`). The current user comes from the JWT; any `userId` in a body or path is ignored.
- Never run Docker, `docker compose`, the backend or ai-module locally. Local is only `mvn -B package` / `mvn test`; runtime is verified on prod (`infra.md`). The local stack is broken anyway (Postgres volume v17 vs pin 16, Keycloak does not start).
- File access stays inside the declared Balansee repo folders. A downloaded key in `Downloads` is not consent to read it; ask for the exact path (`core/rules/workflow.md`).
- Multi-item change lists (audit follow-ups): one item at a time, description plus importance, wait for approval.
- The repo-level `Balansee-be/CLAUDE.md` is partly stale (Java 23, old CI, "dev profile disables security", roles USER/ADMIN/PREMIUM). Memory and code win; details in `projects/backend.md`.
- External texts (Jira, Confluence) follow `integrations.md`: first person singular, short, no dashes other than hyphens.

Secrets: `secrets/personal.env` (key names in `secrets/personal.env.template`) and the prod `.env` on the server. Never copy values (`core/rules/secrets.md`). Exposed secrets and open rotations: `infra.md` > Security.
