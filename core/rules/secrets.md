# Secrets

- Never write a secret value (password, token, PAT, API key, PIN, encryption key, private cert data) into memory, CLAUDE.md, docs, commits, settings allow rules, Jira, Confluence or chat summaries.
- Exception: test-environment logins for Asseco mobile apps may be kept in project memory (see `contexts/work/adit/clients/asseco/CLAUDE.md`, Test credentials).
- Reference secrets by location and key name only: `secrets/work.env: VSZP_TEST_USER`, or "prod .env on the server: OPENAI_API_KEY".
- Never embed tokens in git remote URLs or in command lines that end up in `settings.local.json` allow lists. Use env vars or a credential helper.
- If a screenshot, file or log shows a credential, flag it once, do not repeat it, recommend rotation if it was exposed.
- `.env` files must be gitignored. If a tracked `.env` is found, report it.
