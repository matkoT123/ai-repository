# Balansee integrations

Credentials: prod `.env` on the server (key names in `secrets/personal.env.template`, prod section) or `secrets/personal.env`. Never copy values.

## Atlassian (Jira + Confluence)
Allowed for Balansee only, through the claude.ai Atlassian connector (`mcp__claude_ai_Atlassian__*`, deferred: load with ToolSearch). Never against any work instance.

- Site `jszinnovations.atlassian.net`; pass it directly as `cloudId` (the UUID `d0caf592-e799-4a10-9c18-5350ad9c5722` also works). Atlassian account = the user's personal gmail.
- Jira project key **`BSEE`**. Confluence space key **`SD`** (URLs show `/spaces/BS`; pass `SD`).
- Find pages with `searchConfluenceUsingCql` (`space = SD and title = "..."`). `getPagesInConfluenceSpace` for the whole space is too large.
- New pages: type Page, matching siblings. Before updating, read the current body first; memory only reflects an older version.
- If the connector fails: REST API v1 with basic auth (`secrets/personal.env: BALANSEE_CONFLUENCE_USER, BALANSEE_CONFLUENCE_API_TOKEN`), body in storage XHTML, `version.number + 1`. Use `py -3`. Never put the token in a command that lands in an allow list. Last fallback: ready-to-paste Markdown.
- Confluence Cloud does not render SVG via `ac:image`; use PNG.

### Jira rules
- `addCommentToJiraIssue` needs **`contentFormat: "adf"`**, otherwise the ADF JSON is stored as literal text. Fix a broken comment by editing it via `commentId`.
- Description = scope of the task only (what and why). Everything about what was done (progress, solution, links) goes into a **comment**, also not into a "Riešenie" section appended to the description.
- Comments go out under the user's name: write like him. Default **two sentences** of prose, no headers or bullets: (1) what is done and its real state (deployed, switched off, waiting for X); (2) what has to happen next plus a clickable Confluence link. Details belong on Confluence.
- Comments cannot be deleted. If a comment on the same topic exists, update it via `commentId`; a new one must say something new.
- Stay on the ticket's topic. First person singular ("spravil som"), never "sme". Slovak. Hyphens only.
- Never transition to Done/Closed on your own; the user decides. Never guess ticket numbers.

### Confluence rules
- Audience: **analyst and FE developer**, not backend. Put in: what the user gets on which plan and why, the user-visible flow step by step, FE integration (endpoints, when to call, example JSON, field meaning, decision table "if X show Y", error codes and reactions), integration traps (async callbacks etc.), what is open and who decides.
- Leave out: Java code, class names, env vars, `docker compose`, deploy or toggle instructions, transactions/locks/migrations/indexes, "build passed" details. Instead of a toggle guide, say how the FE can read the state from the API (e.g. an `enforced` field).
- Internal reasoning goes to memory and code comments, not the shared page. First person singular, hyphens only; fix old plural forms when editing a page.

### Key pages (space SD)
| Page | ID |
|---|---|
| Administratíva (top) | 39485501 |
| Bezpečnosť aplikácie | 74579976 |
| Fin-AI (top, module docs) | 41779202 |
| AI Module / Balansee backend / Notification Module / Audit Module | 58097666 / 58163201 / 75464706 / 80609282 |
| Bezpečnosť AI a ochrana dát | 59768855 (do not overwrite the unrelated "Bezpečnosť" UI page 41222158) |
| Databáza a Entity (docgen overview) | 40861706 |
| Testovanie > Martin > Testovacie scenáre / Testovacie účty; Testovanie > Jakub | 96305154 > 96468994 > 96305178 / 96501761; 96239627 |
| Stripe Billing proposal (BSEE-96) | 82051099 |

Do not put "Martin" into sub-page titles under the Martin page.

### Docgen (entity docs from code)
Backend module `com.balansee.be.docgen` generates the "Databáza a Entity" overview plus 6 domain pages with Graphviz PNG diagrams. Runs in GitLab CI job `confluence-docs` on push to `main` when `data/entity/**`, `docgen/**` or `.gitlab-ci.yml` change (`mvn -B -Pdocs compile exec:java`, needs CI/CD variable `CONFLUENCE_TOKEN`). Entity prose is curated in `src/main/resources/docgen/descriptions.json`. Local dry run: `DOCGEN_DRY_RUN=true`.

## Bank aggregation: Tink, Yapily
- Backend `service/tink`, `service/yapily`; scheduled sync hourly, Tink token refresh every 15 min (`@EnableScheduling` exists since 2026-08).
- Redirect URIs point to `https://api.balansee.sk/...`. Credentials only in prod `.env`: `TINK_CLIENT_ID`, `TINK_CLIENT_SECRET`, `YAPILY_CLIENT_ID`, `YAPILY_CLIENT_SECRET` (both pending rotation, `infra.md`).
- Bank tokens in `bank_connection` are AES-GCM encrypted with `ENCRYPTION_KEY`.
- PSD2/BSEE-46 is waiting for the Tink contract. Two multi-account findings (BSEE-73) cannot be verified without a real bank.

## OpenAI
- Only ai-module calls OpenAI (since BSEE-127, backend has no `OPENAI_API_KEY`). Key in prod `.env`: `OPENAI_API_KEY`.
- Models: utility `gpt-4o-mini` temperature 0 (`AI_UTILITY_MODEL`), assistant chat `AI_ASSISTANT_MODEL` (default `gpt-4o-mini` since BSEE-128; older memory saying gpt-4o is outdated). Token caps per purpose.
- Org data controls: sharing all disabled, API call logging disabled, DPA closed 2026-09-16. Token usage is not tracked yet (TODO, `projects/ai-module.md`).

## Firebase / GCP
- GCP project `balansee-70eba` under the twincode.sk Google Workspace org. Jakub's `info@twincode.sk` is project Owner and Workspace Super Admin.
- Push (FCM): ntf-module reads `FIREBASE_CREDENTIALS_BASE64` (service account JSON). FE has a Firebase web app with a VAPID key.
- Creating a service account key is blocked by org policy `iam.managed.disableServiceAccountKeyCreation`. Unblock: as org admin at **organization** level grant yourself Organization Policy Administrator, override the `iam.managed.*` policy to Off, generate the key, then **revert** to "Inherit parent's policy". Details: memory `project_gcp_org_policy_twincode.md`.

## Mail and SMS
- Mail sender `info@twincode.sk` (Google Workspace): ntf-module `MAIL_USERNAME`/`MAIL_PASSWORD`, and Keycloak realm SMTP uses the same account. When the password changes, update prod `.env` **and** Keycloak SMTP.
- Ops alerts (audit trail health) go to `ALERTS_EMAIL` (`info@twincode.sk`).
- SMS: BulkGate (`BULKGATE_APPLICATION_ID`, `BULKGATE_APPLICATION_TOKEN`, `BULKGATE_SENDER_ID`). SMS is switched off (`SMS_ENABLED=false`), OTP is the fixed test code from `SMS_TEST_CODE`.
- Test accounts must use `@balansee.sk` addresses (Google Workspace MX), not gmail or `test.balansee.sk` (Jakub's rule). Real inbox for verify-email tests: the user's personal gmail. Fake accounts need `emailVerified=true` and empty `requiredActions` via Keycloak admin API.

## Payments and ads
- Payments (BSEE-96): plan model done, no provider integration; Stripe Billing recommended, decision and Stripe account pending.
- Rewarded ads (BSEE-75): deployed behind `ADS_ENABLED` and `PLAN_QUOTA_ENFORCE`, both default false; ad network (AdMob, `ADMOB_AD_UNIT_IDS`) not confirmed.

## Postman
Workspace **Balansee**: collections "Balansee API" (backend), "Balansee AI Module API" (`baseUrl` `https://ai.balansee.sk`), "KEYCLOAK" (token fetch). Confirm IDs with the Postman tools before use. Generate/update rules: `core/rules/postman.md` (Keycloak > collection Bearer `{{access_token}}`).

## SATO kit (FE repo)
Jakub's "SATO Engine" context kit lives in `Balansee-FE/.claude/`:
- `project-config.json`: tracker jira, git gitlab, core branch `main`, Confluence space SD parent `14057653`, branch naming `feature|fix/{ticket}-{title}`, commit `[{ticket}]{title}`, MRs draft + squash + remove source branch.
- `project-workflow.json`: status mapping per issue type; AI must never move tickets to Done/Closed/Resolved/Production.
- `standards/angular.md` (generic Angular 17+ standards) and `work/analyze/*.md` (architecture, api-state, conventions, troubleshooting; `main.md` is the index, load only what the phase needs).
- The engine itself (commands/agents) is **not on disk**; only its config and analysis files are. Treat the files as Jakub's project documentation; do not edit them unless asked.
