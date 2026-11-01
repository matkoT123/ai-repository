# Work integrations

Where things live and how they are reached. No secrets here: credentials are in `secrets/work.env` (key names in the template) or in Passwork (Asseco).

## Network access
- Most Asseco systems (`nexus`, `gitlab`, `gitlab-prem.*`, `zlp3.vszp.local`, JT test envs `*.assecosk.local`) need the Asseco VPN. On a phone: OpenVPN.
- Asseco TLS uses `Asseco Central Europe Root CA`; JDK and tools must trust it (see `clients/asseco/build-env.md`).
- Adit hosts (`git.adit.sk`, `dev.adit.sk`) are reachable without VPN.

## Git hosts
| Host | Owner | Notes |
|---|---|---|
| `git.adit.sk` | Adit | Groups `asseco/*` (client mirrors), `asseco/sezam-ai/*`, `aconsulting/*`. The group name `asseco` makes MR breadcrumbs look like the Asseco git; check the host. |
| `git.asseco-ce.com` | Asseco | VSZP (`mobilny-vyvoj/vszp/...`) |
| `gitlab-prem.assecosk.local` | Asseco | SEZAM mobile (`sezam/mobile-development/android/...`, `sezam/mtoken/android/...`) |
| `gitlab-prem.asseco-ce.com` | Asseco | Same SEZAM group under another name (product-mtoken-android remote) |
| `gitlab` (short internal name) | Asseco | `gitlab/OUBBUCARD/sezam/*` (sezam-ai repos), `gitlab/general/ai/plugins-marketplace` |
Push rules: `rules/git.md`. Remote mapping: `clients/asseco/rules/git-asseco.md`.

## Jira
| Prefix | Project | Instance |
|---|---|---|
| `ZPIS-`, `ZPHD-`; `SP<number>` = VSZP change request id | VSZP | Asseco Jira |
| `JTSRAUTH-`, `ASB-` | J&T mToken / MFLL | Asseco Jira |
| `SEZAM-`, `ITWORK-`, `REQ-` | SLSP mToken, SEZAM | Asseco Jira |
- Two work Jiras exist: **one Asseco Jira** (J&T, SLSP, VSZP and others, split by project category) and **Adit's own Jira**.
- Asseco Jira is Data Center (`https://jira.acld.cloud`, v11.3), not Atlassian Cloud.
- **Only one Claude path to a work Jira: `/work-skills:asseco-jira`, read-only, started by the user.** Its GET-only script runs only in the `claude-asseco` profile inside Asseco folders, with the PAT in `secrets/work.env: ASSECO_JIRA_TOKEN` (full user rights, expires 2027-01-20). Claude never invokes it unprompted and never reaches Asseco Jira any other way (curl, browser, MCP).
- No connection at all to Adit's Jira. The claude.ai Atlassian connector is for personal projects only (Balansee site); never connect it to a work instance. Work has no Confluence.
- Work input: `G:/nogames/asseco-android/claude-materials/jira/<PROJECT>/<KEY> - <summary>/task.md` + `attachments/` from the skill (index `README.md` there), or XML/PDF exports the user drops there; read those. Output (comments, worklogs) is text the user pastes himself (`rules/writing-sk.md`, `/jira-comment`, `/worklog`).

## Documentation
- SEZAM SharePoint (DocsPublic sites ivp_sezam, JTSR_AUTH) and SECV SharePoint 2016 are mirrored read-only into `sezam-docs-mirror` (see `clients/asseco/projects/sezam-ai.md`). Cite the `source` URL from file frontmatter.
- Sparx EA model: same mirror, `ea/*.csv`.
- SEZAM Dev Handbook: `sezam-marketplace/docs/handbook/`.
- VSZP specs and analyses arrive as `.docx` (read via zipfile, see `core/rules/environment.md`).

## Build and delivery
- Nexus: host `nexus` (VPN). Repos: `DIVIZIE_MOBILNEHO_VYVOJA-releases`, `public-qbsw` (VSZP), `sezam-releases` (mToken SDK `com.mtoken:sdk`). Credentials via env vars or `local.properties`, see `clients/asseco/build-env.md`.
- Jenkins: SLSP builds (job `slsp-mtoken-android`) and mToken SDK publishing.
- GitLab CI: SBOM pipelines.
- Dependency-Track: SBOM uploads from jt-mtoken and SLSP pipelines. Use the project's Components tab, not the global search.
- Google Drive folder "ZLP3 apk": all VSZP APKs (internal, VSZP test, prod), managed by Richard Janitor. User has read access as `tremko@adit.sk`.
- Google Sheet "Vszp MA strings": shared translation sheet with iOS, see `clients/asseco/projects/vszp.md`.
- Firebase (Remote Config, Crashlytics, FCM) per app.

## Chat
- Slack: Adit workspace. Team chat with Filip, moravec (iOS), Jurenka; VSZP threads with Karol Mravec and testers also appear here.
- MS Teams: Asseco side. Backend (Černý, Vesecký, Oravec), release management (Richard Janitor), Jurenka.
- Claude cannot read either. The user pastes text or screenshots.

## Postman
- Workspace "VšZP" (id `9d529d7b-2456-4989-aab5-e65ec837ebf6`). Generate/update rules: `core/rules/postman.md`.

## Test consoles
- J&T Sezam admin console (SK ITP-B): `sezam-jtsr-test.jtsritp4.assecosk.local/sezamapi/gui`. CZ has its own console. Search by User ID; clear the prefilled alias "android".
- SEZAM read-only Oracle access (`db_ro_user`) via the sezam-marketplace `init-connections` skill, values in `~/.sezam/.env`.
