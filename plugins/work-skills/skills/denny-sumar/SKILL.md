---
name: denny-sumar
description: Build a daily summary from today's git commits (and this session) as a standup text and a worklog text, both in Slovak, put into the clipboard. Triggers - "denny sumar", "sumar dna", "co som dnes robil", "standup", "text na standup", "daily", "co vykazem dnes". Read-only git, only real work.
---

# denny-sumar

Produce two short texts from what really happened today: a standup text and a worklog text.

## Gather (read-only)

1. Repos: the current repo; if the user names more repos or says "vsetky asseco", also those (Asseco roots from the work context). Never fetch unless the user asks.
2. Commits: `git log --all --since=midnight --author=tremko --format='%h %ad %s' --date=format:%H:%M` in each repo. For "vcera" use `--since=yesterday.midnight --until=midnight`; on Monday ask whether Friday is meant.
3. Also use what this session did and what the user adds in the prompt. Uncommitted work counts only if the user confirms it.
4. If nothing is found, say so and ask what to include. Never invent work.

## Standup text

- Slovak, two or three short lines, plain text, no bullets or leading hyphens:
  `Včera: ...` (or `Dnes:` when summarizing the current day), `Ďalej: ...` only if the user says what comes next, `Blokery: ...` only if real blockers exist.
- Group commits into topics; do not list commit messages one by one.

## Worklog text

- Follow the style of the `worklog` skill exactly: impersonal noun form ("Oprava ...", "Doplnenie ..."), continuous text, no bullets, no dashes, no AI filler, project terminology, routine steps (build, push, docs) left out.
- If the user works on several tickets, one paragraph per ticket, prefixed by the ticket number only when the user gives it or it is in the branch name or commit message.

## Output

The terminal indents every line of a reply, so copied text carries leading spaces. Use the clipboard:

1. Show both texts in the chat for review, standup first, worklog second, as plain paragraphs.
2. Copy the worklog text with `Set-Clipboard -Value '<text>'` (double every `'`) and say "Worklog skopirovany do schranky. Napis 'standup do schranky', ak chces ten."
3. On request copy the other one. If the clipboard call fails, show the text in a code block as a fallback.

Optionally one line: "Vynechane (neoverene): ...".
