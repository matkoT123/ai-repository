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
  guard/                   push guard hook (work hosts never, personal only on request)
  dev-agents/              springboot, android, angular, react
  work-skills/             asseco-commit, adit-asseco-sync, filip-audit, worklog, jira-comment, bug-report
settings/                  settings fragments merged by install.ps1
secrets/                   LOCAL ONLY, gitignored (template committed)
install.ps1                writes stub CLAUDE.md files into roots, registers marketplace
```

## Conventions

- Markdown for rules and knowledge, JSON only for machine config (settings, manifests, project registry).
- One rule lives in exactly one file. Other files link to it, never copy it.
- No secrets in this repo, ever. Reference `secrets/<file>` by name only.
- No em or en dashes. Hyphens only.
- Dated ticket status notes go to `archive/` of the client, not into active context.
- Existing per-project memory in `~/.claude/projects/*/memory` stays the record of ongoing work. This repo holds the durable, curated layer.

## Install

See `install.ps1` (writes stubs like `@G:/personal-projects/tremko/ai-logic-claude-context/contexts/work/adit/CLAUDE.md` into each root). Changes apply to new sessions only.
