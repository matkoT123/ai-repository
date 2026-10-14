# ucimInak (Ucim Inak)

Backend for an educational games platform for kids (subjects, games such as pexeso, counting, fill-in; license codes unlock entitlements). Replaces a localStorage-only frontend. Assignment: `Ucim_Inak_backend_databazove_zadanie.pdf` in the repo.

## Repo
- Path: `G:/nogames/OsoboneProjekty/andrej/ucimInak`
- Remote: `github.com/matkoT123/ucimInak` (user's own GitHub, not ARULIFE)
- One commit, 2026-05-11. Frontend not on disk.

## Stack
- Spring Boot 3.4.5, Java 21, PostgreSQL + JPA (Hibernate 6), MinIO, Lombok, MapStruct, springdoc.
- Auth: own JWT in an HTTP-only cookie (SameSite=Lax, 7 days). Not Keycloak, unlike Professionals.
- Package `com.ucimimak.backend`. 10 tables: users, entitlements, license_codes, subjects, games, game_metadata, game_message_pools, pexeso_configs, pexeso_pairs, media_assets.

## Design decisions (keep)
- Unidirectional JPA relations (child > parent only).
- `Game.metadata` is `@Transient`, filled by services.
- JSONB via `@JdbcTypeCode(SqlTypes.JSON)`.
- `subjects.id` and `games.id` are immutable string slugs (FE routes depend on them).
- `DataSeeder` seeds demo subjects, games, an admin user and license codes when `subjects` is empty.

## Run
`compose.yaml` (Postgres `localhost:5432/ucimimak_dev`, MinIO `localhost:9000`), then the Spring Boot app. Memory: `~/.claude/projects/G--nogames-OsoboneProjekty-andrej-ucimInak/memory/project_ucimimak.md`.

## Security notes
- PAT in remote URL, see [CLAUDE.md](CLAUDE.md).
- Credential values committed in `src/main/resources/application.yml` (datasource password, JWT secret, MinIO keys) and default credentials in `compose.yaml`.
- Seed admin credential written in plain text in the memory file above and in `DataSeeder`; must be changed before any deployment.
