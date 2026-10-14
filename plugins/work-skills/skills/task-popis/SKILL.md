---
name: task-popis
description: Write a short Slovak task description for the timesheet plus a time estimate, as clean copy-ready text put into the clipboard. Triggers - "popis tasku", "popis do vykazu", "task do vykazu", "odhad", "kolko to bude trvat", "nazov tasku", "task description", "estimate". Only real or clearly planned work the user describes.
---

# task-popis

Produce a task title for the timesheet and a time estimate. Nothing else around it.

## Style

- Imperfective verbal nouns (-anie / -ovanie), as the user wants it: "Prerábanie obnovy tokenu na SDK", "Upratovanie logovania", "Odstraňovanie starých REST volaní", "Písanie unit testov". Not past participles ("Migrovaná obnova", "Upratané logovanie"), not perfective nouns ("Upratanie", "Oprava"), not "sme" or "som". The user finds those robotic.
- Natural wording, the way a developer says it to a colleague: "aby sa chyby zo SDK nelogovali dvakrát" instead of "zdeduplikované logovanie".
- Length: a title, then one sentence of 2 to 4 activities joined by commas and "a". Roughly 200 to 300 characters per task. Name the main class or SDK function once (`AccessTokenRepository`, `mToken.authenticateFirstLevel()`), but leave out lists of endpoints, DTOs, counts of tests or call sites, and internal details such as cache timeouts.
- Ticket prefix `<TICKET> - ` when the user gives one.
- Several tasks: one paragraph per task, separated by an empty line.
- Clean text: no bullets, no numbering, no leading hyphens, no trailing period, no quotes.
- Project terminology and names (mToken, OCRA, SDK, countery), not paraphrases.
- Slovak with proper diacritics. Hyphens only, never em or en dashes. No AI filler ("úspešne", "komplexne").

## Splitting or shortening a task

When the user pastes a long description and asks to split it (e.g. into 2 tasks of 4h), group the work by topic so that each task is one coherent piece of work. Keep every main point, but drop the detail. Use the hours the user gives.

## Estimate

- Format: `Odhad: 4h` (whole or half hours, e.g. `0.5h`, `2h`, `1.5d` only for multi-day work; 1d = 8h).
- Base it on what is known: the user's description, the code if it is open in the session, the Jira ticket if given. Read-only.
- If there is nothing to base it on, ask one concrete question instead of guessing.
- If the user gives the time, use it exactly.
- Ticket number: only the one the user gives, never guessed.

## Output

The terminal indents every line of a reply, so text copied from the chat carries leading spaces. Put the result into the clipboard:

1. Copy with the PowerShell tool: `Set-Clipboard -Value '<text>'` (double every `'`; use "`r`n" in a double-quoted string for line breaks). Copy the descriptions only. Copy the estimates too only when the user asks for them. Plain text, no leading or trailing spaces.
2. In the chat, show each description with its `Odhad:` line for review and add one line: "Skopirovane do schranky."
3. If the clipboard call fails, say so and show the text in a code block as a fallback.

Example (one task split into two):
<TICKET> - Prerábanie obnovy tokenu na SDK a odstraňovanie nepoužívaného podpisovania. Prepisovanie AccessTokenRepository do Kotlinu nad mToken.authenticateFirstLevel(), odstraňovanie starých REST volaní a písanie unit testov
Odhad: 4h

<TICKET> - Upratovanie logovania, aby sa chyby zo SDK nelogovali dvakrát. Prechádzanie logovania v aplikácii a v SDK, odstraňovanie duplicitných záznamov na server a spisovanie podkladu pre analytikov, čo aplikácia loguje a prečo to nepatrí do SDK
Odhad: 4h
