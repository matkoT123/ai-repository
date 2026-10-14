---
name: adit-asseco-sync
description: Sync a branch (usually main or develop) between the adit and Asseco remotes by fast-forward only, with a Filip check before adit to Asseco. Triggers - "zosynchronizuj adit a asseco", "sync adit asseco", "dorovnaj main", "dotiahni asseco do aditu", "dotiahni adit do asseca", "su remoty v syncu", "sync remotes", "adit asseco drift". Claude runs read-only git and prints the push command; the user pushes.
---

# adit-asseco-sync

Fast-forward-only sync of one branch between ADIT and ASSECO remotes. Output a short result and one copy-paste block. Output to the user in Slovak, hyphens only.

## Hard rules

- Claude never pushes. It may run `fetch`, `log`, `remote -v`, `merge-base`, `ls-remote`.
- Never force-push in this skill. Divergence = stop and ask.
- Filip Zemla must never reach Asseco: check before any adit > Asseco push.

## Step 1 - resolve remotes by URL

`git remote -v`. `git.adit.sk` = ADIT. `gitlab-prem.assecosk.local`, `gitlab-prem.asseco-ce.com`, `git.asseco-ce.com`, internal `gitlab/...` = ASSECO. Names differ per copy (`Projects/*`: origin=Asseco, adit=adit; `aditCopyProjects/*`: origin=adit, asseco=Asseco). Unknown host or missing role: stop and ask.

Branch: the one the user named; default `main` (VSZP uses `develop`). Confirm it exists on both with `git ls-remote --heads <remote> <branch>` when unsure.

## Step 2 - fetch and compare both directions (one batched call)

```bash
git fetch $ADIT --prune && git fetch $ASSECO --prune
git log --format='%h | %an <%ae> | %s' $ASSECO/<b>..$ADIT/<b>    # only on adit
git log --format='%h | %an <%ae> | %s' $ADIT/<b>..$ASSECO/<b>    # only on Asseco
```

## Step 3 - decide

| only-on-adit | only-on-Asseco | Result |
|---|---|---|
| empty | empty | Already in sync. Say so, no commands. |
| empty | commits | Asseco ahead: `git push $ADIT $ASSECO/<b>:<b>` |
| commits | empty | Adit ahead: run Filip check first, then `git push $ASSECO $ADIT/<b>:<b>` |
| commits | commits | Diverged. STOP. List both sides, do not propose a push. Suggest reconciliation options (merge, rebase, cherry-pick) and let the user decide. |

## Step 4 - Filip check (adit > Asseco only)

```bash
git log --format='%an <%ae> | %cn <%ce>' $ASSECO/<b>..$ADIT/<b> | sort -u
git log --format='%B' $ASSECO/<b>..$ADIT/<b> | grep -inE 'filip|zemla|žemla|aconsulting|co-authored'
git diff $ASSECO/<b> $ADIT/<b> | grep -inE 'filip|zemla|žemla|aconsulting|@author'
```

`authorise`, `authorisation`, `DataAuthorisationOtp` are false positives. Any real hit: no fast-forward. Tell the user to squash-rewrite first (use the asseco-commit skill) and stop.

## Step 5 - output

```
Remoty: adit = <name> (<url>), asseco = <name> (<url>)
Vetva: <b>
Len na adit: <n> | Len na Asseco: <n>
Smer: Asseco > adit | adit > Asseco | v syncu | DIVERGENCIA (stop)
Filip check: cisto | <hits> | n/a
```
```bash
git push <remote> <src-remote>/<b>:<b>     # cielova URL: <url>
# overenie po pushi (oba musia byt prazdne):
git fetch $ADIT && git fetch $ASSECO
git log --oneline $ADIT/<b>..$ASSECO/<b>
git log --oneline $ASSECO/<b>..$ADIT/<b>
```

Note: a push to Asseco `main`/`develop` may be refused by protected-branch rules; then an MR on Asseco is needed instead. End with a one-line summary.
