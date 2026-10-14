# Git safety (hard rules)

Enforced by the `guard` plugin hook and by `ask` permissions; these rules apply even if a project's settings allow more.

## Push

| Target | Push allowed |
|---|---|
| Work hosts: `git.adit.sk`, any Asseco host (`gitlab-prem.assecosk.local`, `gitlab-prem.asseco-ce.com`, `git.asseco-ce.com`, internal `gitlab/...`), partner hosts `gitlab.alfabase.sk`, `gitlab.dcmc.sk`, any repo under a work root | **Never.** Give the exact command and target URL; the user pushes manually. |
| Personal: `gitlab.com/balansee/*`, `github.com/matkoT123/*`, `github.com/ARULIFE/*` | Only after the user explicitly says to push in this conversation. |
| Any other or unknown host | Never. Stop and ask. Never guess a host. |

- Always show the exact target URL before a push.
- Never add a work host as a remote, never clone from it on the user's behalf.

## Fetch and read-only git (work included)
- Reading from work remotes is allowed: `git fetch`, `pull --ff-only` on the user's request, `ls-remote`, `log`, `diff`. This covers Adit (`git.adit.sk`) and every Asseco host. "Connecting" to a work git only forbids pushing and changing remotes, not fetching.
- Fetch when the user says so ("fetchni adit / origin / asseco": exactly that remote, no further question), or when Claude needs fresh data, asks "môžem fetchnúť <remote>?" and the user confirms.
- If the needed remote does not exist in this clone (e.g. SLSP has only Asseco `origin`), say so and give the `git remote add` command for the user to run. Do not refuse the fetch itself.

## Commit

- Never commit automatically. Show the diff and wait. The user reviews in the IntelliJ Git > Commit tab.
- Work: commit only after an explicit instruction ("commitni", "commit it"). Push stays manual.
- Personal: after the user confirms ("ok", "yes", "looks good"), commit and push in one go to the personal remote.
- Only commit code that builds. Run the project build first; if it fails, fix or report, never commit.
- Never guess a ticket number for a commit or MR. Ask.
- Never set someone else as commit author. Rewrite only to the user's own identity unless a client rule allows a named colleague.
- No `Co-Authored-By` or AI attribution lines.

## Destructive operations

`reset --hard`, `push --force`, `filter-branch`, `rebase` on shared branches, deleting branches: show the command, explain the effect, let the user run it.
