# SHMU - environmental data system (KVAKV)

Backend for the Slovak Hydrometeorological Institute (SHMU), project KVAKV: collecting, processing and evaluating measurement data. Adit (partly via Microcomp) worked on the `overview` service. CV entry: "Environmental data system for a public institution: backend for collecting, processing and evaluating measurement data".

## Status
Inactive. Martin's commits in overview 2023-10-11 to 2024-07-04 (169). Last commit 2024-07-29 (data-registry).

## Paths
- `C:/PROJECTS/WORK/SHMU/SHMU-overview-1/overview` - main service Martin worked on
- `C:/PROJECTS/WORK/SHMU/SHMU-dataRegistry-1/data-registry`, `SHMU-history-1/history`, `SHMU-commonTool-1/common-tool` - neighbouring services (reference)
- `C:/PROJECTS/PROJECTS_TO_WORK/shum/overview` - early overview clone from `https://git.adit.sk/microcomp-shmu-kvapka/overview.git` (5 commits, 2023-09/10)

## Repos (`https://gitlab.dcmc.sk/shmu-kvakv/<repo>.git`, client host, never push)
| Repo | Purpose | Stack |
|---|---|---|
| overview | Aggregated views over measurement data: computation engine, column dependency engine, rounding, time series, scheduled jobs, Alfresco documents, RabbitMQ events | Java 21, Spring Boot 3.2.1, Postgres, Flyway, Keycloak JWT resource server, WebFlux clients generated from `api/api-docs-{catalog,codelist,data-registry}.yaml`, MapStruct, hypersistence-utils, Alfresco Java REST starter, Helm chart, GitLab CI |
| data-registry | REST API around the main data storage, multi-module (catalog/codelist clients, change-management of data product schemas, job-executor, synchronization) | Java, Maven multi-module |
| history | History service (service/client/config modules) | Java 17, Spring Boot 3.0.2 |
| common-tool | Small shared tool | Spring Boot 3.0.1 |

Contributors to overview: Jurenka (420), Tremko (172), Filip Zemla (129), Tomas Filo.

## Build / run
- `mvn clean install -P docker`, then `docker compose up` (history, overview). `init/init.sql` seeds the DB.
- Deployed with Helm (`chart/`) via `devel.gitlab-ci.yml`; Maven settings in `ci_settings.xml`.

## Worth reusing
Package layout `api/{controller,service,bundle}`, `component`, `config`, `dal/{domain,repository}`, `event`, `rabbitmq`; Keycloak JWT converter and API client factories per upstream service.
