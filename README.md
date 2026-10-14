# ai-logic-claude-context

Central Claude Code context for all of Martin Tremko's projects. One source of truth for rules, project knowledge, agents, skills and safety guards. Private repo, contains client and colleague names.

## Layers

| Layer | Folder | Loaded where |
|---|---|---|
| Core | `core/` | Every session (imported from `~/.claude/CLAUDE.md`) |
| Work (Adit agency) | `contexts/work/adit/` | Parent `CLAUDE.md` in every work root |
| Work client | `contexts/work/adit/clients/<client>/` | Parent `CLAUDE.md` of that client's root |
| Personal | `contexts/personal/<area>/` | Parent `CLAUDE.md` of personal roots |
| Platform agents | `plugins/dev-agents/agents/` | Subagents, available everywhere |
| Skills | `plugins/<name>/skills/` | Plugin enabled globally or per root |
| Guards | `plugins/guard/` | Hooks enforcing git rules, enabled globally |

More specific layer wins on conflict: project > client > work/personal > core.

## Layout

```
core/                      CLAUDE.md + rules/*.md (everywhere)
contexts/
  work/adit/               agency rules, integrations, clients/
  personal/                balansee, andrej-razus, cunikova, me, hobby
plugins/
  .claude-plugin/marketplace.json
  guard/                   push guard + account guard hooks
  dev-agents/              springboot, android, angular, react
  work-skills/             work skills (table below)
  personal-skills/         personal skills (table below)
bin/                       claude-asseco wrappers (ps1, cmd, bash), installed to ~/.local/bin
settings/                  settings fragments merged by install.ps1
secrets/                   LOCAL ONLY, gitignored (template committed)
install.ps1                writes stub CLAUDE.md files into roots, registers marketplace
```

## Two accounts

| Command | Profile | Account | Use |
|---|---|---|---|
| `claude` | `~/.claude` | tremko@adit.sk (ADIT) | personal and Adit work |
| `claude-asseco` | `~/.claude-asseco` | martin.tremko@asseco-int.com | Asseco projects only |

Type the command at the shell prompt, not inside a running session. Before `/login`, check the email in `/status`: `/login` always changes the profile of the running session. The guard checks the real logged-in email: the Asseco account is blocked outside Asseco folders in any profile, the default profile in Asseco folders gets a loud warning.

## Skills

Use them in plain words ("napis worklog, dnes som ...") or directly as `/<name> <text>`. `/skills` lists them. Text skills put the result into the clipboard, because the terminal indents copied lines.

| Skill | What it does | Example trigger |
|---|---|---|
| `worklog` | Slovak Jira worklog text, impersonal noun form, to clipboard | "napis worklog" |
| `task-popis` | Task description for the timesheet plus time estimate, to clipboard | "popis tasku", "odhad" |
| `denny-sumar` | Standup and worklog text from today's git log | "denny sumar", "standup" |
| `odpoved-ticket` | Short factual reply to a tester or colleague, to clipboard | "odpoved testerovi" |
| `jira-comment` | Slovak Jira comment for incidents and bug analyses | "jira komentar" |
| `bug-report` | Bug report, developer or tester variant | "bug report" |
| `asseco-commit` | Squash commit with the correct author, prints push commands | "commit do asseca" |
| `adit-asseco-sync` | Fast-forward sync of a branch between remotes, prints push command | "sync adit asseco" |
| `filip-audit` | Read-only check that a colleague's traces are not in Asseco-bound commits | "filip audit" |
| `resync-colleague-branch` | Cherry-pick a colleague's new commits into the re-authored copy | "dosync filipa" |
| `server-check` (personal) | Read-only Balansee production server health check over SSH | "skontroluj server" |

## Changing a plugin

1. Edit files under `plugins/<plugin>/`, bump `version` in its `plugin.json` and in `marketplace.json`.
2. Commit and push.
3. For both profiles: `claude plugin marketplace update tremko-context` and `claude plugin update <plugin>@tremko-context` (same with `claude-asseco`).
4. `/reload-plugins` in open sessions.

## Conventions

- Markdown for rules and knowledge, JSON only for machine config (settings, manifests, project registry).
- One rule lives in exactly one file. Other files link to it, never copy it.
- No secrets in this repo, ever. Reference `secrets/<file>` by name only.
- No em or en dashes. Hyphens only.
- Dated ticket status notes go to `archive/` of the client, not into active context.
- Existing per-project memory in `~/.claude/projects/*/memory` stays the record of ongoing work. This repo holds the durable, curated layer.

## Install

See `install.ps1` (writes stubs like `@G:/personal-projects/tremko/ai-logic-claude-context/contexts/work/adit/CLAUDE.md` into each root). Changes apply to new sessions only.
