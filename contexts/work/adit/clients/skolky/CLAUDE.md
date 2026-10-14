# Skolky - kindergarten application backend (Adit)

Backend for a kindergarten application ("Backend side of application for kindergarten"). Early-stage Spring Boot skeleton.

## Status
Inactive. Folder last modified 2024-07-29. No git repo locally (also `skolky-be.zip`).

## Paths
- `D:/ACONSULTING_PROJECTS/skolky/skolky-be` (+ `skolky-be.zip`)

## Stack
Java 21, Spring Boot 3.3.2, Spring Web, Data JPA, Security, MySQL. Package `aconsulting.skolky_be.sk`, layout `api/{controller,dal,enums,mapper,service}`. Maven wrapper.

## Open questions
- `core/rules/identity.md` lists skolky under Andrej Razus (personal, GitHub org ARULIFE). The user says this D: folder is Adit work. Is it the same product handed over, a parallel Adit version, or unrelated? Keep the two contexts separate until clarified.
- Remote repo, if any, is unknown.

## Security notes
- Literal `spring.datasource.password` in `skolky-be/src/main/resources/application.properties`.
