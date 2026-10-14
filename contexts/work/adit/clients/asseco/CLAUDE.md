# Client: Asseco CE

Loaded from the Asseco roots `G:/nogames/asseco-android/Projects` and `G:/nogames/asseco-android/aditCopyProjects`. Adds to the Adit layer (`../../CLAUDE.md`).

@rules/git-asseco.md
@team.md
@build-env.md

Two working copies exist for most repos:
- `Projects/<repo>`: origin = Asseco, `adit` = Adit.
- `aditCopyProjects/<repo>`: origin = Adit, `asseco` = Asseco.
Always identify the remote by URL (`git remote -v`), never by name.

## Fetch (Adit and Asseco remotes)
Fetching is allowed in every Asseco repo, from both the Adit and the Asseco remote: run it when the user says "fetchni <remote>", or ask "môžem fetchnúť <remote>?" and run it after a yes. Only pushing is forbidden. Older project memory notes saying "never touch origin" or "do not fetch Asseco" are outdated; this file wins. If the fetch fails on credentials (no TTY), report it and give the command with `!` for the user.

## Test credentials for mobile apps
Test logins for the apps' test environments (test users, passwords, SMS codes, PINs, debug unlock PINs for HLT, ITP, dev, UAT and similar) may be remembered: save them into the project memory and use them directly when testing on a device or emulator. Allowed by the user (2026-10-12) as an exception to `core/rules/secrets.md`.
- Never production credentials, never real customer data.
- Values go only into local files: project memory or `secrets/work.env`. Not into files of this context repo (it goes to GitHub), not into commits, Jira or MRs.

## Projects
Read the matching file when work starts on a project. Each links to its memory dir for current status.

| File | Project |
|---|---|
| `projects/vszp.md` | VšZP patient app (vszp-android), Slovak health insurer, Android |
| `projects/jt-mtoken.md` | J&T Banka mToken app (jt-mtoken-android), SK/CZ, migration to the new SDK |
| `projects/mtoken-sdk.md` | New mToken SDK, its test app, the old MFLL libraries; how the 4 repos relate |
| `projects/slsp.md` | Slovenská sporiteľňa mToken app (mtoken-slsp-android) |
| `projects/sezam-ai.md` | SEZAM AI tooling: docs mirror, plugin marketplace, read-only DB, mirrored to Adit |

Stale dated status notes: `archive/README.md`. Unresolved conflicts for the user: `open-questions.md`.
Generic Android topics (adb, emulator, Compose, Gradle): see `plugins/dev-agents/agents/android.md`.
