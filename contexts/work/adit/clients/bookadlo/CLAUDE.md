# Bookadlo - reservation system (KDRKO)

Adit's own reservation/booking product (`bookadlo.sk`). Started as the KDRKO site (static booking pages for named branches, e.g. Karadzicova, Karpatska, with GDPR/VOP PDFs), then a Spring Boot backend (DB name `rezmaster`) and an Angular admin frontend with calendar and room calendar. A newer deployment runs MODULES services (uaa, codelist, doc) under the Bookadlo name.

## Status
Dormant. Last commits: bookadlo-server 2026-02-10 (ticket 636, Tremko), bookadlo-frontend 2025-10-06 (Filip Zemla), prod-stack/dev-stack 2025-10-09 (BKDL-470). Jira prefix `BKDL-` (older tickets numeric in branch names `feature/4xx`).

## Paths
| Folder | Content |
|---|---|
| `D:/ACONSULTING_PROJECTS/KDRKO-OLD-BOOKADLO/BE/bookadlo-server` | Backend |
| `D:/ACONSULTING_PROJECTS/KDRKO-OLD-BOOKADLO/BE/database*` | MySQL dumps of `rezmaster` (2024-11-07) |
| `D:/ACONSULTING_PROJECTS/KDRKO-OLD-BOOKADLO/FE/kdrko-frontend` | Old static/AngularJS site + admin |
| `D:/ACONSULTING_PROJECTS/NEW_BOOKADLO2/bookadlo-frontend` | Angular frontend |
| `D:/ACONSULTING_PROJECTS/NEW_BOOKADLO` | Empty |
| `D:/ACONSULTING_PROJECTS/BOOKADLO/DEV stack/dev-stack`, `PROD stack/prod-stack` | Docker Compose stacks |

## Repos (all `https://git.adit.sk/bookadlo/<repo>.git`, never push)
| Repo | Stack | Contributors |
|---|---|---|
| bookadlo-server | Java 21, Spring Boot 3.4.0, MySQL + Flyway, JPA + JDBC, WebSocket, Security, MapStruct, springdoc, plugin mechanism (`plugin/` package, `plugins/` dir), Mailgun e-mail, SMS API, export, scheduler. Since 2020. | Jurenka (most), Tremko (131) |
| kdrko-frontend | Static HTML + gulp + AngularJS admin, since 2015 | Jurenka, Jakub Novota |
| bookadlo-frontend | Angular 13 (generated with CLI 12), Angular Material, FullCalendar, Dockerfile + nginx | Filip Zemla (146), Tremko |
| dev-stack, prod-stack | Compose: nginx (host network), Portainer, Postgres, RabbitMQ, Redis, Keycloak 26.1, `uaa-be/doc-be/codelist-be-bookadlo-{dev,prod}` images, Alfresco 23.4 + Share + Solr + ActiveMQ; helm chart skeleton | Tremko |

## Build / run
- Backend env vars: `VERBOSE_LOGGING`, `LOG_SQL`, `MYSQL_HOST`, `ADMIN_HOST`, `PUBLIC_HOST` (see `readme.md`). `./mvnw spring-boot:run`.
- Frontend: `ng serve` with `proxy.conf.json`; `swagger.json` holds the backend API.
- Server: `reload.sh` pulls images and `docker compose up -d`. Prod Keycloak host `backend4.bookadlo.sk/keycloak`.

## Open questions
- How does bookadlo-server (MySQL) relate to the modules-based prod-stack (Postgres)? Migration in progress or two separate products?
- Filip Zemla is the main frontend author: check `../asseco` rules before any Asseco-related history rewrite; for Bookadlo no restriction is known.

## Security notes
- secret present in `KDRKO-OLD-BOOKADLO/BE/bookadlo-server/src/main/resources/application.properties` (literal `mailgun.api-key`, `sms-api.access-token`).
- Literal DB/Keycloak/Alfresco passwords in `BOOKADLO/PROD stack/prod-stack/compose.yaml` and `DEV stack/dev-stack/compose.yaml`.
- `KDRKO-OLD-BOOKADLO/BE/database*/*.sql` are full DB dumps, likely with customer personal data.
