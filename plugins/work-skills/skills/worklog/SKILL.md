---
name: worklog
description: Turn a description of done work into a short Slovak Jira worklog text in the user's confirmed style. Triggers - "worklog", "napis worklog", "text do worklogu", "vykaz", "co vykazem", "popis na vykazanie", "zaloguj hodiny text", "write worklog". Only real, verified work.
---

# worklog

Produce a ready-to-paste Slovak worklog description. Nothing else around it except a one-line note if something was dropped as unverified.

## Style (confirmed by the user)

- Impersonal noun form: "Oprava ...", "Priprava ...", "Overenie v kode, kam aplikacia uklada ...", "Presun ...", "Prepojenie ...", "Doplnenie ...". Not "sme", not "som", not infinitive, not passive ("doplnene su").
- Short sentences. One to three sentences for a typical day, more only if there are more real topics. Continuous text, NO bullets, NO numbered points, NO leading hyphens, so it pastes directly.
- Use project terminology and function names (e.g. `reconfigure()`, `deactivate()`, OCRA, countery, blokery, FDS), not descriptive paraphrases.
- Do not list routine steps (publish to mavenLocal, documentation update, build, push) and do not call small parts of a bigger change "oprava X" separately.
- When shortening, keep every factual topic, drop only details (e.g. enumerations of error types).
- Must not read like AI: no filler, no evaluative phrases, no "uspesne", no "komplexne".
- Slovak with proper diacritics. Hyphens only, never em or en dashes.

## Truthfulness

- Only work that really happened and can be verified (from the user's description, this conversation, git log, Jira). Never write "as if done". If the user mentions something uncertain or planned, leave it out and say so in one line.
- To ground it, Claude may read `git log --since=<date> --author=tremko --format='%h %s'` or the Jira ticket, read-only.
- Ticket number: use only the one the user gives; if the worklog must reference a ticket and none is given, ask.

## Output

The terminal indents every line of a reply, so text copied from the chat carries leading spaces. Put the text into the clipboard instead:

1. Copy it with the PowerShell tool: `Set-Clipboard -Value '<worklog text>'` (double every `'` inside the text). Plain text only: no code block, no quotes around it, no leading or trailing spaces, no trailing newline.
2. In the chat show the text once as a plain paragraph for review and add one line: "Skopirovane do schranky."
3. If the clipboard call fails, say so and show the text in a code block as a fallback.

Optionally one line: "Vynechane (neoverene): ...". If the user says "skrat", shorten keeping all topics and copy the new version again.

Example of the tone:
`Overenie v kóde, kam aplikácia ukladá OCRA profil a ako sa počítajú countery. Príprava podkladov k blokerom novej SDK pre analytika. Oprava volania deactivate() pri zrušení aktivácie.`
