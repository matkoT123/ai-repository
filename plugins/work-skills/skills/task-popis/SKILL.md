---
name: task-popis
description: Write a short Slovak task description for the timesheet plus a time estimate, as clean copy-ready text put into the clipboard. Triggers - "popis tasku", "popis do vykazu", "task do vykazu", "odhad", "kolko to bude trvat", "nazov tasku", "task description", "estimate". Only real or clearly planned work the user describes.
---

# task-popis

Produce a task title for the timesheet and a time estimate. Nothing else around it.

## Style

- Past participle plus noun, as the user wants it: "Opravená aktivácia mTokenu", "Doplnená validácia rodného čísla", "Upravené ukladanie OCRA profilu". Not "sme", not "som", not "Oprava ..." (that form is for the worklog skill).
- One short line, ideally under 80 characters. More lines only if the user lists several separate tasks; then one task per line.
- Clean text: no bullets, no numbering, no leading hyphens, no trailing period, no quotes.
- Project terminology and names (mToken, OCRA, SDK, countery), not paraphrases.
- Slovak with proper diacritics. Hyphens only, never em or en dashes. No AI filler ("úspešne", "komplexne").

## Estimate

- Format: `Odhad: 4h` (whole or half hours, e.g. `0.5h`, `2h`, `1.5d` only for multi-day work; 1d = 8h).
- Base it on what is known: the user's description, the code if it is open in the session, the Jira ticket if given. Read-only.
- If there is nothing to base it on, ask one concrete question instead of guessing.
- If the user gives the time, use it exactly.
- Ticket number: only the one the user gives, never guessed.

## Output

The terminal indents every line of a reply, so text copied from the chat carries leading spaces. Put the result into the clipboard:

1. Copy with the PowerShell tool: `Set-Clipboard -Value '<title>'` (double every `'`). If the user wants the estimate copied too, put it on a second line. Plain text, no leading or trailing spaces.
2. In the chat show the title and the estimate as plain lines for review and add one line: "Skopirovane do schranky."
3. If the clipboard call fails, say so and show the text in a code block as a fallback.

Example:
Opravená aktivácia mTokenu pri zrušení profilu
Odhad: 3h
