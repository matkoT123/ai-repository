---
name: asseco-task-flow
description: End-to-end flow for a bugfix or a new task in an Asseco Android repo - correct branch, fetch, merge the base branch (VSZP develop, J&T/SLSP/SDK main), fix, build and tests, device test, worklog text with estimate, commit, push command for the user. Triggers - "oprav to", "sprav fix", "bugfix", "novy task", "ideme na task", "rob to podla postupu", "checkout, merge develop, fix, test", "merge main, fix, test", "task flow", "fix flow". Claude never pushes; it prints the push command.
---

# asseco-task-flow

The user's standard order for every bugfix or new task (VSZP, jt-mtoken, SLSP, SDK). Go step by step, report briefly after each step, and stop on the first problem. Rules that always apply: `core/rules/git-safety.md`, `contexts/work/adit/rules/git.md`, `clients/asseco/rules/git-asseco.md`, `core/rules/workflow.md` (consistent but never worse).

## 1. Correct branch
Base branch by project (from `git-asseco.md`, Conventions): **VSZP** `develop` (flow `develop` > `stage` > `master`); **jt-mtoken, 365-mfll, product-mtoken-sdk, product-mtoken-android** `main`; **SLSP** `main` (releases on `stage/release-XX`). J&T and SLSP have no `develop`. Below, `<base>` means that branch.

- Find the repo or worktree that holds the task (`git worktree list`, project memory). Identify remotes by URL, never by name (Asseco = `git.asseco-ce.com`, `gitlab-prem.*`; adit = `git.adit.sk`).
- Existing task branch: check it out. New task: create it from `<asseco>/<base>` with `--no-track` and the project naming (`feature/SP<n>-ZPIS-<n>-<desc>`, `fix/...`; ticket never guessed). VSZP only, base by phase: production bug or new feature `develop`, demo bug `stage`, beta bug `master`; ask when unclear. J&T/SLSP hotfix of a release: ask which branch (`main` or a release branch).
- `git status`: local-only changes (version bump in `app/gradle.properties`, integration URL switch, Nexus repos, temporary test hooks) are never committed. Before a merge restore them (`git checkout -- <file>`) and re-apply after, if still needed.

## 2. Fetch
- Fetch the client remote (Asseco is allowed, only push is forbidden). Compare local branch with its copies on the remotes (`git rev-parse --short` on local, Asseco, adit). If a remote is ahead, say so before doing anything.
- If the output of a git command shows a token in a remote URL, flag it once (rotation, credential helper), never repeat it.

## 3. Merge the base branch
- Dry run first: `git merge-tree --write-tree --name-only HEAD <asseco>/<base>`. Conflicts: list the files, stop, ask.
- Merge with a message without the word adit: `git merge --no-ff -m "Merge branch '<base>' into <branch>" <asseco>/<base>`.
- Skip this step only if the branch already contains `<base>` (`git merge-base --is-ancestor`).

## 4. Fix
- Large or unclear analysis: delegate a read-only analysis to the `dev-agents:android` subagent with a full brief (symptom, BE contract, files to start from, what is verified vs hypothesis), then verify its key claim in code yourself before relying on it.
- Write the fix in the style of the surrounding code; improve bad local patterns in touched lines, ask before shared or wide changes. Add or update unit tests for the changed logic.
- Files with CRLF line endings: prefer the Edit tool over multi-line `perl`/`sed` (multi-line regex silently misses on CRLF). After edits, grep that no old symbol is left.

## 5. Build and tests
- JDK 17: `JAVA_HOME="C:/Program Files/Java/jdk-17" ./gradlew <module tests> :app:assemble<Flavor>Debug` (VSZP: `:domain:test` + `assembleAsseco_vpnDebug` for HLT ROZ; jt-mtoken consumes the SDK from `mavenLocal`, publish the SDK first when it changed). Report the test count and failures. `:data` unit tests in VSZP did not compile on develop (2026-10); say so instead of skipping silently.
- After a killed build: `./gradlew --stop`.

## 6. Device test
- Only when the user asked for it in this task (this flow counts as asking). Pixel 10a over wireless adb; adb at `/c/Users/marti/AppData/Local/Android/Sdk/platform-tools/adb.exe`.
- Install with a Windows path (`adb install -r "$(cygpath -w <apk>)"`); `MSYS_NO_PATHCONV=1` only for `adb shell` paths. Then `pm clear`, test login and a new PIN per project memory (VSZP debug unlock always sends `085236`, so set exactly that PIN).
- Drive the UI by uiautomator dump + tap by text (scratchpad `ui.sh`), batch steps into one call. Check logcat of the app pid for exceptions and HTTP status of the relevant calls.
- Test the reported scenario first (reproduce on the old build if it is cheap), then regression of the neighbouring flows. A problem that can't be reproduced naturally may be simulated by a temporary debug-only hook: mark it `TEMP ... NEKOMITOVAT`, remove it after the test and confirm with `git status`.
- Real submissions on test environments (forms, payments) only with the user's consent for that submission.

## 7. Worklog text with estimate
- Only after the fix works. Slovak, task-popis style: optional `<TICKET> - ` prefix (only a ticket the user gave), title, one sentence of 2 to 4 activities, `Odhad: <h>`. Real work only; subtract what the user already logged on the ticket. Copy to clipboard with `Set-Clipboard`, show it in chat.

## 8. Commit
- Build must have passed in step 5 (on the final code). Stage only the intended files, never local-only changes.
- Identity `Martin Tremko <tremko@adit.sk>`; message per project (VSZP `fix(SP<n>-ZPIS-<n>): ...` / `feat(...)`, English, no adit, no AI trailer). Check with `git log -1 --format='%an <%ae> | %cn <%ce>'`.

## 9. Push command
- Author check of the range `<asseco>/<branch>..HEAD` (Filip `zemla@adit.sk` allowed from 2026-10-20, never `aconsulting`, see `git-asseco.md`), and `git merge-base --is-ancestor` to confirm a fast-forward.
- Print the exact command and the target URL, without a leading `!`: `git push origin <branch>:<branch>` (`https://git.asseco-ce.com/...`). After the user pushes, fetch and confirm the remote SHA.

## Output
Short report per step. At the end: what changed and why, test results, device test result, worklog text with estimate, commit SHA, push command.
