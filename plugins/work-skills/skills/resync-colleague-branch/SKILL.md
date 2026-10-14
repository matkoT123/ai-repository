---
name: resync-colleague-branch
description: Bring new commits from a colleague's adit branch into Martin's re-authored copy by cherry-pick plus author amend, never merge. Triggers - "dosync filipa", "dosyncuj filipa", "dotiahni filipove commity", "sync filip branch", "resync colleague branch", "cherry-pick filip". Example pair - adit/task/implementation-sdk > feature/JTSRAUTH-7625-implementation-sdk (jt-mtoken-android). Prints commands; the user runs them and pushes.
---

# resync-colleague-branch

Context: Filip works on an adit branch (e.g. `adit/task/implementation-sdk`). Martin keeps a copy of that work under his own authorship (e.g. `feature/JTSRAUTH-7625-implementation-sdk`), because Filip must never appear in Asseco git. Rewritten authors mean different SHAs, so git and GitLab see the branches as unrelated (common ancestor is `main`). Therefore: only cherry-pick, never merge and never an MR from Filip's branch. The copy is append-only, so its push is a plain fast-forward.

Output to the user in Slovak, compact, one command block. Hyphens only.

## Hard rules

- Claude runs only read-only git (`fetch`, `cherry`, `log`, `diff`, `remote -v`, `branch -vv`). Cherry-pick, amend and push are printed for the user.
- Author is always `Martin Tremko <tremko@adit.sk>`.
- The copy branch has NO upstream on purpose, so a bare `git push` cannot hit Filip's branch. Never suggest `--set-upstream` / `-u`. Always push with explicit remote and branch name.
- Never force-push the copy branch.

## Step 1 - resolve

`git remote -v`: ADIT = remote with `git.adit.sk`. Source (SRC) = colleague branch, destination (DST) = Martin's copy. Defaults for jt-mtoken-android: SRC `$ADIT/task/implementation-sdk`, DST `feature/JTSRAUTH-7625-implementation-sdk`. Otherwise ask for both in one question.

## Step 2 - find new commits (read-only)

```bash
git fetch $ADIT --prune
git branch -vv | grep -F '<DST>'                      # confirm no upstream
git cherry -v <DST> <SRC>                             # '+' = new by patch-id, '-' = already in DST
```

`git cherry` compares by patch-id, so no need to remember the last synced SHA. If no `+` lines: say "Nic nove, vetva je zosynchronizovana" and stop.

## Step 3 - print commands

List the new commits (`%h %an: %s`), then one block, oldest first:

```bash
git checkout <DST>
git cherry-pick <sha1> && git commit --amend --no-edit --author="Martin Tremko <tremko@adit.sk>"
git cherry-pick <sha2> && git commit --amend --no-edit --author="Martin Tremko <tremko@adit.sk>"
git log -n <N> --format='%h | %an <%ae> | %s'
git diff <SRC> HEAD --stat                            # MUST be empty
git push $ADIT <DST>                                  # <ADIT URL>, fast-forward, no force, no -u
```

If the repo has `claude-materials/sync-filip.sh` (Git Bash, run from repo root), mention it as the one-liner equivalent: `./claude-materials/sync-filip.sh`.

## Conflicts and verification

- Conflict (only possible once DST has Martin's own commits): resolve, `git cherry-pick --continue`, then amend the author again.
- The verification diff against SRC must be empty. If not empty (and DST has no own commits), something was skipped: report the files, do not hand out the push.
- Never touch Filip's branch.

## Output (Slovak)

```
SRC > DST: <SRC> > <DST> (upstream: ziadny, OK)
Nove commity: <N>
<list>
<one bash block>
Kontrola: git diff musi byt prazdny
```

End with a one-line summary.
