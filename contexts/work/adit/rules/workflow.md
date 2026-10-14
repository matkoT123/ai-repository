# Work workflow

Base workflow (scope discipline, build and verify, context keeping) is in `core/rules/workflow.md`. This file adds work specifics.

## Trigger phrases
| User says | Do |
|---|---|
| "idem robiť na vszp", "zober si kontext vszp" | Read `clients/asseco/projects/vszp.md` and the VSZP memory index, then continue without further questions. |
| "riešime nové SDK", "nové SDKčko" | Read `clients/asseco/projects/mtoken-sdk.md` and `jt-mtoken.md` plus their memory indexes. |
| "idem na jt / mtoken", "slsp", "ipep" | Same pattern with the matching project file. |
| "uložiť kontext", "ulož kontext" | Update the curated memory of the current project (see Context logging). |
| "fetchni adit" / "fetch origin" | Fetch exactly that remote, nothing else. |
| "dosync filipa" | Re-author cherry-pick sync, see `clients/asseco/rules/git-asseco.md`. |
| "daj integráciu na ROZ / BUD" | VSZP local-only flavor switch, see `clients/asseco/projects/vszp.md`. Never staged. |
| "commitni" | Build, then commit per `rules/git.md`. Push command as text. |

## Scope discipline (work specifics)
- A pasted multi-step task prompt (verify > fix > summarize) is staged: do the current step, report, wait. "Over", "či platí ten bug", "skontroluj" = report only, no Edit calls.
- Build, install, launch an emulator or drive a device only when this turn's message asks for it. Exception: a commit always needs a build first.
- Do not implement items owned by a colleague. Check the assignee before treating a row in a task table as the user's (there is a second Martin on VSZP, see `clients/asseco/team.md`).
- Do not delete test files on a device or in `claude-materials/` without asking.
- Uncommitted local-only changes in a work tree (version code, URLs, Nexus repos) are intentional. Do not revert or "clean" them.
- When a client analysis or spec is ambiguous, list the question for the analyst; do not decide product scope.

## Context logging
Decision: prefer curated memory over raw conversation logs.
- Durable facts go into the project memory dir `C:/Users/marti/.claude/projects/<project-dir>/memory/` as topic files with an index line in `MEMORY.md`, written during the session.
- Durable, cross-project knowledge belongs in this repo (project files under `clients/`). Dated ticket status stays in memory and is listed in `clients/<client>/archive/README.md` once stale.
- Detailed task material (Jira XML, specs, reports, scripts) stays in the repo's `claude-materials/<topic>/`; memory holds a pointer to it.
- Do not append whole conversations to `context.txt` or `conversation_log.md` files.
- jt-mtoken `conversation_log.md` (repo and memory copies) and VSZP `context.txt` are frozen history: not imported, not appended. Durable facts live in topic memory files and in `clients/asseco/projects/`.

## Time estimates and reports
- Estimates: include build, device test and delivery, not only coding. Earlier estimates were too optimistic against colleagues' numbers.
- Timesheet totals and worklog texts only for work that happened (see `rules/writing-sk.md`).
