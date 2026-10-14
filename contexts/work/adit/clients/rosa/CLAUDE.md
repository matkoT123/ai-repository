# ROSA - international recruitment platform

Adit product: candidates apply for jobs abroad, upload CVs and documents, companies send demand letters, HR and admins manage the pipeline and billing. Built on the MODULES platform (see `../modules/CLAUDE.md`). CV entry: "International recruitment platform ... Built on the modules above".

## Status
Inactive. Last commit 2025-10-24 (ROSA-920, Martin Tremko). Active development 2025-04 to 2025-10.

## Paths
- `D:/ACONSULTING_PROJECTS/ROSA/rosa-be`
- `D:/ACONSULTING_PROJECTS/ROSA/templates`, `template-*.html` - invoice and e-mail HTML templates (invite, password, invoice, advance invoice)

## Repo
- `https://git.adit.sk/rosa/rosa-be.git` (never push). Contributors: Jurenka (306), Tremko (223), Gandi. Jira prefix `ROSA-`.
- Frontend `rosa-fe` and `rosa-wiki` exist only as images in the stack (`dev.adit.sk:5000/aconsulting.sk/rosa-fe`).

## Stack
Java 23, Spring Boot 3.4.1, PostgreSQL, Flyway, MapStruct, Lombok, springdoc, hibernate-jpamodelgen, Spring Boot Admin client. OpenAPI clients generated from `api/acc-be.yaml`, `codelist-be.yaml`, `doc-be.yaml`, `uaa-be.yaml`. Keycloak realm extensions in `MODULES/uaa/uaa-be/modules/rosa-keycloak`.

## Domain
- Controllers split by role: `controller/admin/*`, `controller/hr/*`, `controller/common/*` (account, password reset).
- Entities: Candidate (passport, language proficiency, licences, required experience), Applicant, Company, Employee, DemandLetter (+ response, clarification, feedback), JobOffer, Benefit, Invoice (incl. advance invoice, deposit payment state), Invitation.

## Build / run
`build.bat` (Maven), `compose.bat`/`compose.sh` start local Postgres, RabbitMQ, Redis. Deployed via `MODULES/stack` (DEV) and `UATstack` (UAT).

## Security notes
- Literal DB passwords and a `token` value in `rosa-be/src/main/resources/application.yaml`; Postgres password in `rosa-be/compose.yaml`.
