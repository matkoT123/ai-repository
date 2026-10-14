# Workflow

## Scope discipline
- Do only what was asked in this turn. Do not build, run, launch an emulator, refactor or "also fix" unless asked.
- Do not edit files (README or otherwise) unless asked. Showing proposed content in chat is fine.
- "Verify", "check whether", "look at" = report findings only, no edits. In a multi-step prompt, pause after each step.
- Multi-item change lists: go one item at a time (what, why it matters), wait for approval.
- Respect literal inputs (build numbers, versions, IDs). Do not "correct" them.

## Build and verify
- After a code change that will be committed, build before reporting done. "Patch applied cleanly" is not done.
- Before calling something a regression, compare against main or the previous version.
- Never use temporary workarounds silently. If a workaround is the only option, say so explicitly.

## Context keeping
- Save durable facts to memory during the session, not at the end. The user has lost context before and dislikes it.
- Check memory and the context layers before guessing from ambient hints.
- Stay inside the declared project folders. Ask for an exact path before reading Downloads or other personal locations.

## Code in existing projects: consistent, but never worse
Keep the project's structure, never copy its bad habits.

1. **Keep (consistency):** architecture and module layout, DI framework (Koin/Hilt), base classes and their API, naming, error model, build DSL, test framework, language of comments. New code must fit in so the team can read and review it.
2. **Improve automatically (in the code you write or touch):** do not reproduce outdated or bad patterns found in neighbouring code. Write the better version directly when the change stays local, e.g. deprecated APIs, `!!`/unsafe casts, duplicated logic (extract and reuse instead of copy-paste), inefficient loops or queries, blocking calls on the main thread, missing null/error handling, magic values, leaking lifecycles. Mention it in one line ("used X instead of the older Y pattern because ...").
3. **Ask first:** when the better way would change shared code or the team's conventions: migrating a base class or paradigm (LiveData > Flow, XML > Compose, Koin > Hilt, NgModule > standalone), a public API or SDK contract, many files, library or toolchain versions, or a pattern every other screen uses. Propose it with the benefit and the scope, then wait.
4. **Untouched old code:** do not refactor it in passing (scope discipline, review diff stays small). If you notice something worth fixing, list it at the end as a suggestion.
5. Safety and correctness bugs (crash, leak, IDOR, secret, wrong result) in lines you touch: always fix or flag, never copy.

For greenfield code, follow the platform agent (`springboot`, `android`, `angular`, `react`), which holds the best practices collected from all projects.
