---
name: bug-report
description: Write a Slovak bug report containing only bugs, in a developer variant (symptom, cause, fix, app vs backend) or a tester variant (steps, actual, expected, no code). Triggers - "bug report", "report chyb", "napis chyby pre vyvojara", "chyby pre testera", "report pre filipa", "report pre testera", "zoznam bugov", "write bug report". Only bugs, nothing else.
---

# bug-report

Ask which variant if not clear from the request: **vyvojar** (dev) or **tester**. Default to dev when the recipient is a developer by name.

## Only bugs

The report contains ONLY bugs. Never include: "Overene bez chyby" sections, OK areas, observations ("postrehy"), overview or status tables, "Neotestovane" lists, ideas, praise. The full status (what is OK, what was not tested) is an internal report for the user only and is not this skill.

Only confirmed bugs. Something uncertain that is not clearly an app bug does not go into the tester report; in the dev report it goes in only if the cause is verified.

## Dev variant (vyvojar)

Per bug, numbered:

```
<N>. <short title>
Prejav: <what happens, where, when>
Pricina: <verified cause, class/method/file:line or API response>
Navrh opravy: <concrete change>
Strana: aplikacia | SDK | backend
```

Code names, endpoints and log lines are welcome. Two to four short sentences per field at most.

## Tester variant (tester)

Per bug, numbered, no code, no class names, no stack traces:

```
<N>. <short title>
Kroky: 1. ... 2. ... 3. ...
Skutocny stav: <what the user sees>
Ocakavany stav: <what should happen>
```

Add environment/build/device only if it matters for reproduction and is known.

## Style

- Slovak with diacritics, short sentences, project terminology, no filler or AI-sounding phrasing.
- Hyphens only, never em or en dashes.
- Never include secrets, PINs, passwords or test account credentials; reference them by location (e.g. `secrets/work.env: <KEY>`).
- Only facts verified in this session (code read, logs, the user's test results). No "as if tested".

## Output

The report text only. If a found item was dropped because it is not a confirmed bug, one line after the report: "Vynechane (nie potvrdena chyba): ...".
