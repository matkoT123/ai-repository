---
name: filip-audit
description: Read-only audit that no trace of Filip Zemla (author, committer, message, trailer, code, comment) is in a commit, range or branch headed for Asseco git or adit main. Triggers - "filip audit", "skontroluj filipa", "je tam filip", "ziadna stopa po filipovi", "over autorov", "check for filip", "audit authors", "zemla check". Reports clean or hits, changes nothing.
---

# filip-audit

Read-only. Claude runs the commands itself and reports in Slovak, compact. Never modifies anything.

**Asseco account session** (context says "runs on the Asseco account"): run nothing. Reply only `Filip audit spusti v Adit profile: obycajny claude v tom istom repe.` and stop.

## Rule being checked

Filip Zemla (`zemla@aconsulting.sk`, any `filip`, `zemla`, `žemla`, `aconsulting` identity) must never appear anywhere in Asseco git, and never on adit `main`. Not as author, committer, in commit messages, `Co-Authored-By`/`Signed-off-by` trailers, code, comments or `@author` tags. Allowed authors on Asseco: Martin Tremko `tremko@adit.sk`, Vladimir Jurenka. `tremko@aconsulting.sk` is not Filip but is also unwanted on Asseco (should be `tremko@adit.sk`): report it as a warning.

## Input

The user gives a SHA, a range (`A..B`), or a branch. If a branch, audit `<base>..<branch>` where base is the Asseco target (resolve the Asseco remote by URL: `gitlab-prem.assecosk.local`, `gitlab-prem.asseco-ce.com`, `git.asseco-ce.com`, internal `gitlab/...`; adit is `git.adit.sk`). If base is unclear, ask, or audit the whole branch history.

## Commands (one batched call)

Single commit `<sha>`:
```bash
git log -1 --format='%H | %an <%ae> | %cn <%ce>' <sha>
git show <sha> | grep -inE 'zemla|žemla|filip|aconsulting'
```

Range or branch `<R>`:
```bash
git log --format='%an <%ae> | %cn <%ce>' <R> | sort -u
git log --format='%H%n%B' <R> | grep -inE 'filip|zemla|žemla|aconsulting|co-authored|signed-off'
git diff <range-base>...<tip> | grep -inE 'filip|zemla|žemla|aconsulting|@author'
```

Whole tree at tip (code and comments):
```bash
git grep -In -i -e filip -e zemla -e 'žemla' -e aconsulting -e '@author' <tip> -- .
```

## Interpreting

- `authorise`, `authorisation`, `DataAuthorisationOtp` and similar are false positives (not `@author`). Drop them from the report and say "falosne zhody ignorovane: N".
- Gitignored folders (e.g. `claude-materials/`) never reach git; hits there do not count. Confirm with `git check-ignore -v <path>` if a hit is in such a path.
- Identical full SHA on adit and Asseco means identical authorship and content (author and committer are part of the hash). To confirm what is on Asseco, compare the SHA from `git rev-parse <asseco-remote>/<branch>`; no need to inspect further.
- Filip as author of commits on an adit `task/...` branch is expected. The question is only whether it would land on Asseco or adit `main`.

## Output (Slovak)

```
Rozsah: <sha|range|branch>
Autori/committeri: <unique list>
Vysledok: CISTO | NAJDENE
<if hits: one line per hit - type (author/message/code), sha or file:line, text>
```

If NAJDENE: say it must be squash-rewritten before reaching Asseco (asseco-commit skill) and stop. End with a one-line summary.
