# Professionals

Two-sided listing platform: providers publish profiles (attributes, photos, availability, priced services/"practices"), clients browse. Adult content with an age gate on the FE; keep descriptions neutral in any output. FE package name `luxmuses`. Production domains are configured in the infra Traefik rules.

## Repos
| Part | Path | Remote | Last commit |
|---|---|---|---|
| Backend | `D:/ARUPROJECT/PROFESIONALS/ProfesionalsBE` | `github.com/ARULIFE/ProfesionalsBE` | 2026-06-17 |
| Frontend | `G:/personal-projects/razus/professionals/ProfesionalsFE` | `github.com/ARULIFE/ProfesionalsFE` | 2026-03-22 |
| Infra | `D:/ARUPROJECT/PROFESIONALS/Professionals-infra` | `github.com/matkoT123/Professionals-infra` | 2026-04-01 |

Contributors: BE almost all by the user (88 commits, from 2025-09-20). FE mostly by `adora` (6), the user added Dockerfile + GHCR pipeline.

## Backend
- Spring Boot 3.5.6, Java 23, PostgreSQL, Keycloak 26.1 (realm `professionals`, client `professionals-backend`), MinIO for images, WebSocket starter, Actuator.
- Cloned from the Balansee BE template (see [CLAUDE.md](CLAUDE.md)).
- Package `com.professionals.be`. Entities: User (PROVIDER/CLIENT, keycloakId), Profile (1:1 user, embedded PhysicalAttributes, images 1:N), Practice (global or custom), ProfilePractice (price), Image (MinIO objectKey).
- Roles from JWT claim `resource_access.professionals-backend.roles` (USER, ADMIN, PREMIUM). Ownership checked in services, current user via `CurrentUserSupplier`.
- `app.security.enabled` true in dev, off in docker profile; docker context path `/professionals`; `ddl-auto: update` (no migrations, so new non-null columns need a DB default, see last commit).
- Local: `compose.yaml` (Postgres on 45448, Keycloak on 8088, MinIO 9000/9001). Swagger at `/swagger-ui/`.
- Endpoint and entity detail: memory `~/.claude/projects/D--ARUPROJECT-PROFESIONALS-ProfesionalsBE/memory/project-overview.md`.

## Frontend
- Next.js 16, React 19, TypeScript, Tailwind v4, pnpm. Repo `CLAUDE.md` documents structure.
- Still mock data (`lib/mockProfile.ts`) and mock localStorage auth; integration points listed in the repo CLAUDE.md. Not yet wired to the BE (BE uses Keycloak, FE CLAUDE.md suggests cookie auth: align before integrating).
- CI: GitHub Actions `build-and-push` to `ghcr.io/arulife/profesionalsfe`.

## Infra
- `compose.yml`: Traefik v3, `ghcr.io/arulife/professionals-backend`, `ghcr.io/arulife/profesionalsfe`, Keycloak, Postgres 16, MinIO, Portainer, Watchtower (auto-pull). Secrets via `.env` (gitignored).
- Keycloak realm exports under `data/docker/keycloak/realms/`, DB init in `data/docker/sql/`.

## Security notes
- Credential values committed in `ProfesionalsBE/src/main/resources/application.yaml` (datasource password, Keycloak client secret, MinIO keys) and `application-dev.yaml`.
- Default dev credentials in `ProfesionalsBE/compose.yaml`.
- Local `.env` present in `Professionals-infra` (gitignored, fine).
- Token in FE remote URL, see [CLAUDE.md](CLAUDE.md).
- Realm export JSON files may contain client secrets; check before sharing.
