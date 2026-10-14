---
name: odpoved-ticket
description: Write a short, factual Slovak reply to a tester or colleague about a ticket or bug (Teams, Slack, Jira, email), no AI style, put into the clipboard. Triggers - "odpoved testerovi", "odpis kolegovi", "napis odpoved", "co mu mam napisat", "reply to tester", "odpoved k ticketu". Never sends anything by itself.
---

# odpoved-ticket

Produce a ready-to-send reply. Nothing else around it.

## Style

- Slovak with proper diacritics, informal but professional, as one colleague writes to another. Use the form of address the user uses with that person (ty/vy); if unknown, use "ty" for colleagues and testers and ask for clients.
- Short: one to four sentences. Answer first, then the reason or the next step only if needed.
- Facts only: what was found, what was fixed and in which version or branch, what the tester should retest and how. If something is not known, say it plainly ("este overujem", "zistim do ..."), never invent.
- Use project terms (mToken, OCRA, build number, flavor), the exact build or version the user gives, the ticket number only if the user gives it.
- No AI tone: no greetings like "Ahoj, dakujem za spravu", no "urcite", "samozrejme", "uspesne", "komplexne", no apologies unless the user asks, no emojis.
- Hyphens only, never em or en dashes. No bullets unless the user asks for steps; then short numbered steps.

## Truthfulness

- Ground the reply in the user's description, this session, git log or the ticket (read-only). Do not claim a fix is deployed or released unless the user or git confirms it.
- If the reply would promise a date or scope the user did not state, leave it out and ask.

## Output

The terminal indents every line of a reply, so copied text carries leading spaces. Put the reply into the clipboard:

1. Copy with the PowerShell tool: `Set-Clipboard -Value '<reply>'` (double every `'`). Plain text, no leading or trailing spaces.
2. In the chat show the reply once for review and add one line: "Skopirovane do schranky."
3. If the clipboard call fails, say so and show the text in a code block as a fallback.

Never post it to Jira, Teams, Slack or email yourself.

Example:
Opravené v builde 1.4.12, padalo to pri zrušení aktivácie, keď sa nezmazal starý OCRA profil. Prosím pretestuj aktiváciu po odinštalovaní a novej inštalácii.
