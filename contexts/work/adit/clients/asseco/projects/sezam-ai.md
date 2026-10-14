# SEZAM AI tooling (sezam-ai)

Infrastructure by the Asseco SEZAM team (contacts Jakub Tropp, Vladimir Jurenka) so Claude Code and Codex can work with SEZAM documentation, the EA model and databases. Built for JTSR/JTCZ/SECV but meant as the Asseco-wide pattern. Not set up for VSZP; do not assume it exists there.

## Repos
| Repo | Path | Remotes |
|---|---|---|
| `sezam-docs-mirror` | `G:/nogames/asseco-android/Projects/sezam-ai/sezam-docs-mirror` | origin = Asseco `gitlab/OUBBUCARD/sezam/sezam-docs-mirror`, `adit` = `git.adit.sk/asseco/sezam-ai/sezam-docs-mirror` |
| `sezam-marketplace` | `G:/nogames/asseco-android/Projects/sezam-ai/sezam-marketplace` | origin = Asseco `gitlab/OUBBUCARD/sezam/sezam-marketplace`, `adit` = `git.adit.sk/asseco/sezam-ai/sezam-marketplace` |
The Adit subgroup is `asseco/sezam-ai` (not `sezam`, which collides with `asseco/sezam-api`). Mirror refresh procedure: `rules/git-asseco.md`.

## sezam-docs-mirror
- Read-only, machine-generated mirror of SharePoint (DocsPublic ivp_sezam, JTSR_AUTH; SECV SP2016 DocsPrivate) and the Sparx EA model as Markdown/CSV.
- Start at `INDEX.md`; rules in `AGENTS.md`. Never edit `sharepoint-*/`, `ea/`, `INDEX.md`, `.sync/`. Cite the `source` URL from frontmatter, EA GUIDs for model elements.
- Sync is manual for now; hourly sync waits on Entra app registration, a firewall exception and a runner Docker upgrade.

## sezam-marketplace
- Claude Code + Codex plugin marketplace (commit/MR messages, code review, unit tests, repo AI setup, `init-connections`) plus the SEZAM Dev Handbook in `docs/handbook/`.
- Its own CLAUDE.md defines authoring invariants (two catalogs and two manifests per plugin in sync, version bump on every change, Slovak content, no secrets in the handbook). Follow it when editing there.
- Install: `/plugin marketplace add https://gitlab/OUBBUCARD/sezam/sezam-marketplace.git`; `common` globally, tech plugins per repo.

## Read-only DB
Shared Oracle account for JTSR/JTCZ/SECV TEST and DEV, created by `init-connections` into `~/.sezam/.env` (gitignored). Password comes from Jakub Tropp. Key names: `secrets/work.env: SEZAM_DB_RO_USER, SEZAM_DB_RO_PASSWORD`. Jurenka's team wants it for error logs that apps write into the DB.
