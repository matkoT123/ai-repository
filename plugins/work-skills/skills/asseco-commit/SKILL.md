---
name: asseco-commit
description: Prepare a squash commit with the correct author for the Asseco git and print the push commands for the user. Triggers - "idem commitovat do asseca", "commit do asseca", "squash do asseca", "squashni to do asseca", "priprav commit pre asseco", "asseco commit", "squash for asseco", "prepare asseco push". Claude never pushes; it runs read-only git, audits for Filip, checks the build and prints one copy-paste command block.
---

# asseco-commit

Goal: the user types a short phrase and gets, fast, a short checklist result plus ONE copy-paste command block that squashes the work under an allowed author and pushes adit first, Asseco last. The user runs every write command himself.

## Hard rules

- Claude NEVER pushes, never force-pushes, never resets, never squashes, never creates MRs. Print commands only.
- Claude MAY run read-only git: `fetch`, `log`, `diff`, `cherry`, `remote -v`, `rev-parse`, `merge-base`, `ls-remote`, `branch -vv`, `merge-tree --write-tree` (dry run). Anything not clearly read-only counts as write.
- Allowed authors on Asseco git: `Martin Tremko <tremko@adit.sk>` (default) and Vladimir Jurenka (ask the user for his email, never invent it). Never `tremko@aconsulting.sk` either, always `tremko@adit.sk`.
- Filip Zemla (`zemla`, `filip`, `aconsulting`) must never appear in Asseco git: not as author, committer, in messages, trailers or code.
- Never guess a ticket number. If the commit message needs one and the user did not give it, ask. There are no default ticket numbers.
- Commit only code that builds. No `Co-Authored-By`, no AI attribution.
- Output to the user in Slovak. Hyphens only, no em or en dashes.

## Step 1 - resolve remotes by URL (never by name)

Run `git remote -v`. Classify each remote by host:

| Host in URL | Role |
|---|---|
| `git.adit.sk` | ADIT |
| `gitlab-prem.assecosk.local`, `gitlab-prem.asseco-ce.com`, `git.asseco-ce.com`, internal `gitlab/...` | ASSECO |

Names are inverted between copies: `Projects/*` has `origin`=Asseco, `adit`=adit; `aditCopyProjects/*` has `origin`=adit, `asseco`=Asseco. Use the resolved names (`$ADIT`, `$ASSECO`) in every printed command and print both full URLs. If a role is missing or a host is unknown, stop and ask. Never add a remote yourself.

## Step 2 - gather (read-only, one batched call)

```bash
git fetch $ADIT --prune && git fetch $ASSECO --prune
git rev-parse --abbrev-ref HEAD
git status --short
git log --format='%h | %an <%ae> | %cn <%ce> | %s' $ASSECO/<target>..<source>
git diff --stat $ASSECO/<target>...<source>
git log --oneline <source>..$ASSECO/<target>     # Asseco drift, must be 0 or handled first
```

Determine `<source>` (task branch, e.g. `$ADIT/task/<TICKET>` or local branch) and `<target>` (e.g. `main`, `develop`, an integration `feature/...` branch). If unclear, ask in one question. If `$ASSECO/<target>` has commits the source lacks, report it: the squash must start from `$ASSECO/<target>` (Asseco is authoritative).

## Step 3 - Filip audit on what would go in

**Asseco account session** (context says "runs on the Asseco account"): skip this step, run none of its commands. In the output write `Filip audit: spusti v Adit profile (claude, skill filip-audit) pred pushom` and continue with step 4.

```bash
git log --format='%an <%ae> | %cn <%ce>' $ASSECO/<target>..<source> | sort -u
git log --format='%B' $ASSECO/<target>..<source> | grep -inE 'filip|zemla|žemla|aconsulting|co-authored|signed-off'
git diff $ASSECO/<target>...<source> | grep -inE 'filip|zemla|žemla|aconsulting|@author'
```

Hits on `authorise`, `authorisation`, `DataAuthorisationOtp` are false positives (not `@author`). Filip as author of source commits is expected and is exactly why we squash; a hit in the DIFF or in the message text you will reuse is a blocker: stop and report the file/line.

## Step 4 - build check

Ask "Bol build uspesny?" unless the user already said so in this conversation. If not built, offer to run it (Claude may run builds):
- Android/Kotlin (`gradlew` + Android plugin): `./gradlew assembleDebug` with `JAVA_HOME="C:\Program Files\Java\jdk-17"` (JDK 21 breaks with Inconsistent JVM-target). After a killed build: `./gradlew --stop`.
- Gradle backend: `./gradlew build -x test` (or with tests if the user wants).
- Maven: `mvn -q -DskipTests package`.
No green build, no commit commands.

## Step 5 - print ONE command block

Pick the variant that fits; show only that one (mention the others in one line if relevant).

**A) Squash merge of a task branch onto the Asseco target** (default):
```bash
git checkout <target>
git reset --hard $ASSECO/<target>          # start from Asseco truth; drops local-only commits on <target>
git merge --squash <source>                # e.g. $ADIT/task/<TICKET>; remote-tracking ref, not bare name
git commit --author="Martin Tremko <tremko@adit.sk>" -m "<message>"
git log -1 --format='%an <%ae> | %cn <%ce>'
git push $ADIT <target>                    # <ADIT URL>   (add --force-with-lease only if adit/<target> was rewritten)
git push $ASSECO <target>                  # <ASSECO URL> last
```
`merge --squash` only stages ("not updating HEAD" is expected); the commit creates it. If the source MR on adit was bypassed, tell the user to Close (not merge) it in GitLab and optionally `git push $ADIT --delete task/<TICKET>`.

**B) Soft-reset squash of the current branch** (branch already contains the work, e.g. `feature/...`):
```bash
git log --oneline <branch>..$ASSECO/<base>   # must be empty, else rebase/merge base first
git reset --soft $(git merge-base <branch> $ASSECO/<base>)
git commit --author="Martin Tremko <tremko@adit.sk>" -m "<message>"
git log --format='%h %an <%ae> %s' $ASSECO/<base>..<branch>   # exactly 1 commit, Martin
git push --force-with-lease $ADIT <branch>   # <ADIT URL>
git push $ASSECO <branch>                    # <ASSECO URL>, add --force-with-lease only if it already existed there
```

**C) GitLab squash MR rehost (VSZP style)**: if the user prefers the GitLab UI squash MR `task/<TICKET> > feature/...` on adit: the squash commit author = the MR AUTHOR (committer = whoever clicks Merge, assignee irrelevant). So Martin must CREATE the MR himself, uncheck "Delete source branch", then push the resulting `feature/...` to Asseco. UI-made commits carry `tremko@aconsulting.sk`: check with `git log -1 --format='%ae'` and rewrite to `tremko@adit.sk` before pushing to Asseco. After a squash merge, the colleague should back-merge `feature` into `task` so the next MR is clean.

The commit message follows the repo convention (look at `git log --oneline -10 $ASSECO/<target>`), e.g. `JTSRAUTH-7519 - Short description` (J&T) or `feat(SP97302-ZPIS-94892): short description` (VSZP). Ticket from the user, never guessed.

## Output format (Slovak, compact)

```
Remoty: adit = <name> (<url>), asseco = <name> (<url>)
Zdroj > ciel: <source> > <ASSECO>/<target>, <N> commitov, <M> suborov
Drift na Asseco: 0 | <list>
Filip audit: cisto | <hits>
Build: OK (<command>) | chyba odpoved
<one bash block>
Po pushi: <MR close / delete branch note if any>
```

Nothing more unless something blocks. End with a one-line summary.
