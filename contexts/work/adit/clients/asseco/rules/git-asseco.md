# Git for Asseco repos

Adds to `contexts/work/adit/rules/git.md` (no push ever, commit on instruction, build first) and `core/rules/git-safety.md`.

## Hosts
| Side | Hosts |
|---|---|
| Asseco (client, authoritative) | `git.asseco-ce.com`, `gitlab-prem.assecosk.local`, `gitlab-prem.asseco-ce.com`, `gitlab` (internal short name) |
| Adit (our mirror, test side) | `git.adit.sk` |

## Remote mapping (verified 2026-10-09 with `git remote -v`)
| Local copy | origin | other remote |
|---|---|---|
| `Projects/VSZP/vszp-android` | Asseco `git.asseco-ce.com/mobilny-vyvoj/vszp/vszp-android` | `adit` |
| `aditCopyProjects/VsZP/vszp-android` | Adit | `asseco` |
| `Projects/jt-mtoken-android` | Asseco `gitlab-prem.assecosk.local/sezam/mobile-development/android/jt-mtoken-android` | `adit` |
| `aditCopyProjects/jt-mtoken-android` | Adit | `asseco` |
| `aditCopyProjects/product-mtoken-sdk-android` | Adit | `asseco` (`gitlab-prem.assecosk.local/...`) |
| `aditCopyProjects/product-mtoken-android` | Adit | `asseco` (`gitlab-prem.asseco-ce.com/...`) |
| `aditCopyProjects/jt-mfll-android` | Adit | none |
| `Projects/365-mfll-android` | Asseco `gitlab-prem.assecosk.local` | `adit` |
| `Projects/mtoken-git/mtoken-slsp-android` | Asseco `gitlab-prem.assecosk.local/sezam/mtoken/android/...` | none |
| `Projects/sezam-ai/*` | Asseco `gitlab/OUBBUCARD/sezam/*` | `adit` (`git.adit.sk/asseco/sezam-ai/*`) |
Remote names can change. Before any remote operation, read `git remote -v` and decide by host.

## Fetch
- Adit remote: fetch freely. Start work with `git fetch <adit> main` + `git merge --ff-only` only when the user asks to update.
- Asseco remote: fetch when the user asks, or after Claude asks and the user confirms (see `core/rules/git-safety.md`, Fetch). jt-mtoken's Asseco origin had no working credential in Claude's shell (auth prompt without TTY); if it fails again, report it and give the `!git fetch <remote>` command, do not loop.
- Before preparing an Asseco push, check Asseco drift: `git fetch <asseco>` then `git log --oneline <adit>/main..<asseco>/main`. Asseco can hold commits Adit lacks (e.g. a version bump by Jurenka). Merge those first.
- Identical full SHA on both sides proves identical author/committer; no need to inspect the Asseco side further.

## Allowed authors
- Asseco git: only `Martin Tremko <tremko@adit.sk>` and Vladimir Jurenka. Nothing else as author or committer.
- Filip Zemla and any `aconsulting` email must never appear in Asseco git: not as author, committer, in messages, trailers, code comments, `@author` tags or files. This includes `tremko@aconsulting.sk` (GitLab web UI commits): rewrite to `tremko@adit.sk` first.
- Adit git: Filip tolerated on side branches (`task/*`), never on `main`.
- Never re-author a commit to a colleague (also not to Jurenka). Rewrite only to the user's own identity; leave genuine colleague commits untouched.

## Filip audit (before every Asseco push command, and before anything lands on adit `main`)
Use `/filip-audit`. Manual equivalent, all must return nothing:
```
git log --format='%an <%ae> | %cn <%ce>' <asseco>/<base>..HEAD | grep -iE 'zemla|filip|aconsulting'
git log --format='%B' <asseco>/<base>..HEAD | grep -iE 'zemla|filip|aconsulting|co-authored|signed-off'
git diff <asseco>/<base>..HEAD | grep -inE 'zemla|filip|aconsulting'
git grep -In -i -e filip -e zemla -e 'žemla' -e aconsulting -e '@author' -- .
```
`author` also matches `authorise`, `DataAuthorisationOtp`; only `@author` tags count. Any hit headed for Asseco: stop and tell the user, do not hand over the push command.

## Sync main between Adit and Asseco
Use `/adit-asseco-sync`. Steps:
1. Fetch both remotes.
2. `git log <asseco>/main..<adit>/main --oneline` and the reverse.
3. Exactly one side non-empty: fast-forward. Give `git push <behind-remote> <ahead-remote>/main:main`. Run the Filip audit first when Asseco is the target.
4. Both non-empty: diverged. No push; decide merge/cherry-pick with the user.
5. After the user pushes, both logs must be empty.
Protected Asseco branches may reject a direct push; then the user opens an MR on Asseco.

## Bringing Filip's work to Adit main and Asseco
Filip's commits never land as-is on Adit `main` or anywhere in Asseco. They arrive either squashed (A, B, D) or re-authored by cherry-pick (C). Pick by situation. Claude prepares and verifies; writing commands run only on the user's instruction; push is always the user.

**A. CLI squash with own authorship** (one finished `task/*` branch into main):
```
git checkout main && git merge --ff-only <adit>/main
git merge --squash <adit>/task/<TICKET>        # use the remote-tracking ref
git commit --author="Martin Tremko <tremko@adit.sk>" -m "<TICKET> - <description>"
```
Then the user pushes and closes the source MR manually (it does not auto-close).

**B. Squash MR on Adit GitLab** (VSZP blind-friendly rehost): the user creates an MR `task/<X>` > `feature/<X>` on Adit with Squash enabled and "Delete source branch" unchecked. The MR must be created by the user, because GitLab sets the squash author to the MR creator. Then push `feature/<X>` to Asseco and open the Asseco MR. Push order after rewrites: Adit first, Asseco last, both `--force-with-lease`.
Squash merges do not record ancestry, so the next MR re-shows everything. Fix on Filip's side after each squash:
```
git merge --no-ff --no-commit origin/feature/<X>
git read-tree -u --reset origin/feature/<X>
git commit
git diff origin/feature/<X>      # must be empty
```
Without this, back-merges show false conflicts in every touched file.

**C. Re-author cherry-pick** (continuous sync of a long-running Filip branch, trigger "dosync filipa"; jt-mtoken `feature/JTSRAUTH-7625-implementation-sdk` from `adit/task/implementation-sdk`). Append-only, push is a plain fast-forward. Script `claude-materials/sync-filip.sh`, manual equivalent:
```
git fetch adit
git checkout feature/<X>
git cherry -v feature/<X> adit/task/<Y>          # '+' = new commits
git cherry-pick <sha>                            # oldest first, for each '+'
git commit --amend --no-edit --author="Martin Tremko <tremko@adit.sk>"
git diff adit/task/<Y> HEAD                       # must be empty
```
Never merge or MR from Filip's branch into the re-authored one. Keep the re-authored branch without upstream.

**D. Squash a feature branch in place** (`reset --soft`, product-mtoken-sdk docs): user-run only, it rewrites history.
```
git reset --soft $(git merge-base main feature/<X>)
git commit -m "..."
git push --force-with-lease origin feature/<X>
```
Safe while `git log feature/<X>..main` is empty.

**Tools for rewriting:** `git commit-tree <tree> -p <parent> [-p <parent2>] -m "..."` with `GIT_AUTHOR_*`/`GIT_COMMITTER_*` env vars rewrites authorship or rebuilds a real merge commit while keeping trees and dates. `git filter-branch` fails on Windows (`could not open 'nul'`). Cherry-picking a merge (`-m 1`) yields a plain commit and GitLab then reports "behind"; rebuild the tip with `commit-tree` and two parents instead.

## Hotfix branches
Production hotfixes branch from `master`/`main` of the Asseco remote, not from `develop`. After `git checkout -b fix/<X> <asseco>/master` run `git branch --unset-upstream`. Update the Adit `master` before pushing the branch there, otherwise the MR drags in every commit Adit's master is missing.

## Mirroring Asseco repos to Adit (sezam-ai)
- Adit colleagues have no Asseco access; the Adit mirror is their only way in. Mirroring needs Asseco-side consent.
- Clone from Asseco with a personal fine-grained PAT, scope group SEZAM, permission Code = Download + Read ("Read" alone fails for clone). PAT lives in `secrets/work.env: ASSECO_GITLAB_PAT` or a credential helper, never in the remote URL.
- Refresh is manual and user-run: pull from Asseco, then push `--all` and `--tags` to Adit. Automation from Adit fails (Asseco is behind VPN); the proposed fix is a `push --mirror` step on the Asseco runner `ivp-sezam-demo`.

## Conventions per project
| Project | Commit message | Branches |
|---|---|---|
| VSZP | `feat(SP<n>-ZPIS-<n>): short description` / `fix(...)` | `feature/SP<n>-ZPIS-<n>-<desc>`, `fix/...`; dev base `develop`; hotfix base `master`. MR title = task name, e.g. `ANDR - Úprava - Servis/modely PZS map` |
| jt-mtoken, 365-mfll | `<TICKET> - Short description` (e.g. `JTSRAUTH-7505 - Terminate app on root detection...`) | `main`; Filip on `task/*`, user on `feature/*` |
| product-mtoken-sdk / product-mtoken-android | Short imperative English (`Add optional newVerificationMode to MToken.verify()`) | `main`; `task/implementation` (Filip), `feature/JTSRAUTH-7625-implemention` |
| SLSP | `fix(ITWORK-<n> / SEZAM-<n>): ...` or `feat: ...`; version bumps `feat: SLSP version XX.YY` | `main`; releases `stage/release-XX`, tags `slsp-release-XX.YY-yymmddNN` |
Ticket numbers are never guessed (`core/rules/git-safety.md`). Use `/asseco-commit` for commits.
