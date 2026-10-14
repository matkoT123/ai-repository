# Alfabase project 149 - registry system for a central government body

Adit staffed developers into partner Alfabase's project "149": an electronic registry/records management system (spisova sluzba, registratura) with Camunda BPM processes for the Slovak telecom and postal regulator (config points to `teleoff.gov.local`). Processes include EZD questionnaires, document intake/filing/dispatch, appeals, and number-usage permits (`P_SS_CR_*`). CV entry: "Central government body: development of backend modules" (confirmed by the user).

## Status
Inactive. Martin's commits 2024-01-18 to 2024-03-27. Last local commits 2024-03 (monorepo 2024-03-20).

## Paths
| Path | What |
|---|---|
| `C:/PROJECTS/MonoRepo/149-monorepo` | Main monorepo (Martin: 134 commits) |
| `C:/PROJECTS/ALFABASE/149-spisova-sluzba`, `149-spisova-sluzba-new/149-spisova-sluzba` | Registry service (two clones) |
| `C:/PROJECTS/ALFABASE/149-sps-ext` | External portal of the registry |
| `C:/PROJECTS/ALFABASE/MODEL-149-new/149-model` | Shared JPA model library |
| `C:/PROJECTS/ALFABASE/bpm-procesy`, `procesy_git/149-bpm-procesy` | Camunda BPMN processes (two clones) |
| `C:/PROJECTS/ALFABASE/camunda-deployer` | Deployer, `https://git.adit.sk/alfabase/camunda-deployer.git` (2 commits, Jurenka) |
| `C:/PROJECTS/camunda-bpm-tomcat-7.20.0` (+ zip) | Local Camunda 7.20 Tomcat distribution |
| `C:/PROJECTS/ACONSULTING PROJECTS/ALFABASE1` | Empty |

## Repos (`https://gitlab.alfabase.sk/alfabase/<repo>.git`, partner host, never push)
149-monorepo, 149-spisova-sluzba, 149-sps-ext, 149-model, 149-bpm-procesy. Large teams (Simon Cmar, Frantisek Pastorek, David Roba, Erik Bujna, ...).

## Stack
- Java 17, Spring Boot 2.7.5, Keycloak adapter + admin client, JPA with hibernate-types, Flyway (MySQL in 149-model), RabbitMQ (AMQP), FreeMarker, mail, springdoc. Shared library `alfa-common`.
- Frontend `spisova_sluzba_fe`: Angular 15.
- Camunda 7.20 (`camunda-engine` module in the monorepo), Jenkins pipelines (`jenkins/`), Docker.
- Monorepo modules: 149-model, 149-OPA, 149-spisova-sluzba, 149-spol-obj, 149-sps-ext, 149-template-engine, alfa-common, camunda-engine, common-model, registratura-facade.

## Conventions
- Issue numbers in branch names (`2543-pvfs-opravy`, `371-formulare-pp`), base branch `dev`.
- Swagger at `/swagger-ui/index.html`.

## Security notes
- Literal password in `C:/PROJECTS/ALFABASE/149-spisova-sluzba/spisova-sluzba-be/src/main/resources/application-local.properties`.
- `C:/PROJECTS/ALFABASE/149-sps-ext/java_pid2548.hprof` is a heap dump and may contain runtime secrets or personal data.
