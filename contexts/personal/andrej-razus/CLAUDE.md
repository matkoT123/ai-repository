# Andrej Razus projects (personal)

Side projects the user builds for or with Andrej Razus ("razus"). Personal work, not Adit. GitHub org `ARULIFE` (Andrej's), some repos under the user's own `matkoT123`. Status checked 2026-10-10 from local clones only (no fetch).

| Project | What | Card | Last activity | Status |
|---|---|---|---|---|
| Professionals | Two-sided profile listing platform (providers and clients), BE + FE + infra | [professionals.md](professionals.md) | 2026-06-17 (BE) | active, intermittent |
| Vendy | Vending machine backend (machines, products, allergens) | [vendy.md](vendy.md) | 2025-10-08 | dormant |
| ucimInak | Educational games platform backend (subjects, games, license codes) | [ucim-inak.md](ucim-inak.md) | 2026-05-11 | early |
| skolky | Listed under Andrej in `core/rules/identity.md`, but no personal copy exists on disk (searched G:, D:, C:/PROJECTS, user profile). The only skolky code is Adit work: [work/adit/clients/skolky](../../work/adit/clients/skolky/CLAUDE.md) | - | - | not on disk |

## Path roots
- `D:/ARUPROJECT` (Professionals BE + infra, Vendy copies)
- `G:/personal-projects/razus` (Professionals FE)
- `G:/nogames/OsoboneProjekty/andrej` (ucimInak)

## Git
- Remotes: `github.com/ARULIFE/*` and `github.com/matkoT123/*` only. Both are personal push targets.
- Commit and push only after the user explicitly says so in the conversation. Full rule: [git-safety.md](../../../core/rules/git-safety.md).
- Commit identity: the user's own (Martin Tremko). `ARULIFE` appears as author only on GitHub-created initial commits and PR merges.
- Branches are `feature/<taskId>` and commit messages start with the task id (`86c5w8rp3 - ...`). The ids look like ClickUp task ids; never guess one, ask (see git-safety.md).

## Shared conventions
- Backend: Spring Boot 3.x, Java 21-23, Maven wrapper, Lombok + MapStruct, springdoc OpenAPI, layered `controller > service > repository > entity` with a mapper layer. Follow [architecture.md](../../../core/rules/architecture.md) and [code-style.md](../../../core/rules/code-style.md).
- ProfesionalsBE was cloned from the Balansee backend template (`gitlab.com/balansee`), so structure (`common`, `exception/core`, `CurrentUserSupplier`, Keycloak + MinIO services) mirrors Balansee. No Balansee names remain in the code. Never push Professionals code to the Balansee remote or the other way round.
- Local infra via Docker Compose (PostgreSQL or MariaDB, Keycloak, MinIO). Images published to `ghcr.io/arulife/*`.
- Postman: on request only, per [postman.md](../../../core/rules/postman.md).

## Security notes
Do not copy values. Rotation recommended where a token is embedded in a remote URL (see [secrets.md](../../../core/rules/secrets.md)).
- GitHub token embedded in the `origin` URL of `G:/personal-projects/razus/professionals/ProfesionalsFE` (`.git/config`).
- GitHub fine-grained PAT embedded in the `origin` URL of `G:/nogames/OsoboneProjekty/andrej/ucimInak` (`.git/config`).
- Per-project credential notes are in each card.

Open questions: [open-questions.md](open-questions.md).
