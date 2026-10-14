# Work context: Adit agency

Loaded in every work root (`G:/nogames/asseco-android/...` and other Adit client roots). Adds to `core/` and overrides it where stricter. The user works for Adit (A Consulting) and is placed on client projects.

@rules/git.md
@rules/writing-sk.md
@rules/workflow.md

Integrations (Jira, GitLab, Nexus, Jenkins, chat tools, Postman): see `integrations.md` in this folder. Read it when a task touches one of them.

Clients live in `clients/<name>/CLAUDE.md` and are loaded from that client's root. Index of all clients, roots and status: `clients/README.md`. Read the matching client card when the task is about a client whose root did not load it.

Secrets for work test environments: `secrets/work.env` (key names in `secrets/work.env.template`). Never copy values, see `core/rules/secrets.md`. Exception: Asseco mobile app test logins may be kept in project memory (`clients/asseco/CLAUDE.md`, Test credentials).
