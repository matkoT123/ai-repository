# Git at work (Adit and all clients)

Base rules (push table, commit policy, destructive operations) are in `core/rules/git-safety.md`. This file adds what is specific to work repos. Client-specific hosts, remotes and procedures: `clients/<client>/rules/git-asseco.md` etc.

## Push
- Claude never pushes to any work host, including `git.adit.sk`. No exception, not even when the user says "pushni" in a work repo: answer with the exact command plus the target URL and stop.
- Prefix such commands with `!` so the user can run them from the prompt.
- Never add, rename or repoint a remote (the harness blocks it anyway). Give the `git remote add ...` command as text.
- Never put a token into a remote URL or a command line. If `git remote -v` shows embedded credentials, report it once (see `core/rules/secrets.md`).

## What Claude may run without asking
Read-only and dry-run only:
- `git fetch <remote>` - only the remote the user named. "fetch adit" means adit only, not also origin.
- `git status`, `log`, `diff`, `show`, `branch -vv`, `ls-remote`, `rev-list`, `merge-base --is-ancestor`, `cherry -v`, `grep`.
- Dry-run merges: `git merge-tree --write-tree A B` to check conflicts without touching the tree.

Everything that writes (merge, checkout, branch create/delete, stash, cherry-pick, rebase, reset, amend, commit-tree, tag) runs only on the user's explicit instruction in this conversation. If unsure whether a command writes, treat it as writing.

## Commit
- Only after an explicit instruction ("commitni", "commit it"). Showing the diff first is the default.
- Build before commit: run the project's build (see the project file; Android needs JDK 17). Build fails > fix or report, never commit. "Patch applied cleanly" is not "builds".
- Stage only the intended files. Never stage local-only changes: `appVersionCode` bumps for test APKs, integration/backend URL switches, uncommented Nexus repos, debug logging.
- Identity is always `Martin Tremko <tremko@adit.sk>`. Check with `git log -1 --format='%an <%ae> | %cn <%ce>'` after committing. Commits made through the GitLab web UI carry `tremko@aconsulting.sk`; rewrite them to `tremko@adit.sk` before the branch is final.
- Ticket number in message or MR title: never guessed from git log, ask (see `core/rules/git-safety.md`). Message format per project: see the client's project files.
- No `--no-verify`, no AI attribution, no `Co-Authored-By`.

## Never committed
- `claude-materials/` (working folder in each repo: patches, Jira exports, reports, scripts). In some repos it is not gitignored (e.g. SLSP), so check `git status` before staging.
- A repo-local `CLAUDE.md` unless the project already tracks one. Do not create repo files like CLAUDE.md without asking.
- Test artefacts (APKs, dumps, `.env`).

## Branch hygiene
- A branch created from a remote base (`git checkout -b x origin/master`) gets `git branch --unset-upstream`, so a bare `git push` cannot hit the client's protected branch.
- Before preparing any push command, check what will go out: `git log --format='%h %an <%ae> | %cn <%ce> %s' <remote>/<base>..HEAD`. The client rules define which authors are allowed.
- MRs are created by the user. GitLab sets a squash commit's author to the MR creator, so MRs that squash colleagues' work must be created by the user.
