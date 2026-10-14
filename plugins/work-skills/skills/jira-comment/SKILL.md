---
name: jira-comment
description: Write a Slovak Jira comment for a client-facing ticket (incident, bug analysis) in the confirmed structure, verified facts only. Triggers - "jira komentar", "napis komentar do jiry", "odpoved do jiry", "text do jiry", "komentar k incidentu", "jira comment", "write jira reply". Never posts by itself unless the user explicitly says to post.
---

# jira-comment

The comment goes to the client (bank, insurer), under the user's name. A previous AI-sounding draft was rejected by a colleague as "cista AI generated zmes". The text must read like a senior developer on the project wrote it.

## Structure (exactly this order, omit a part only if it truly does not apply)

1. **Zaver** - one or two sentences: where the problem is and where it is not (app, SDK, backend, configuration, client side).
2. **O com je incident** - the concrete case: which user/device/time/request, what happened.
3. **Dokumentacia** - what the official documentation says, with a link and an exact short citation in quotes.
4. **Log vs. ocakavanie** - what the log shows (quote the relevant line, timestamps, codes) versus what the system expected.
5. **Preco je to zle** - the specific reason the observed behavior is wrong.
6. **Oprava** - exactly what to change and on which side. One fix, not a menu.

## Rules

- Only verified facts: from logs, code, documentation or Jira the user gave or Claude read in this session. If a part cannot be verified, ask the user or leave the part out. Never fill gaps.
- No speculation: no "mozno", "pravdepodobne", "pripadne skusit X", no lists of unverified alternatives, no unrelated mentions.
- Detailed research and reasoning belongs in the chat, not in the comment.
- Use the project's terminology (names from code and docs). Short sentences, two to four per part. No evaluative or filler phrases. Do not frame things as impossible when it is only a question of where logic lives. Do not write as if the team does not understand its own code.
- Never include secrets, tokens, PINs or personal data beyond what the ticket already contains. Mask IDs if unsure.
- Slovak with diacritics. Hyphens only, never em or en dashes. Plain Jira-friendly formatting (short headings or bold labels, no tables unless asked).
- Do not post. Show the text. Post via the Atlassian tool only when the user explicitly says so in this conversation.

## Output

The comment text in one block, then at most one line listing what was left out as unverified.
