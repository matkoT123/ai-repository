# Writing for work (Jira, worklogs, documents, bug reports)

General style (no em/en dashes, no "as if done" reports) is in `core/rules/response-style.md`. These rules apply to text the user sends to colleagues or clients under his name. It must stand without his rewriting.

## Language
- Internal documents, Jira comments, worklogs, Slack/Teams messages: Slovak. Czech wording from colleagues or the bank is fine to quote.
- Code, commit messages, KDoc and SDK documentation: English (see the project file when it says otherwise).
- Use the project's own terms, not descriptive substitutes: "FDS dáta", "counter", "OCRA", "zmenák", "PZS", function names like `reconfigure()`, `deactivate()`. If the term is unclear, look it up in code or project docs, or ask.

## Jira comments
Short, factual, only what is verified. The audience is often the client or the bank (J&T), not an internal brainstorm.
Structure when explaining a problem:
1. Conclusion: where the problem is and where it is not.
2. What the incident is about, concretely.
3. What the official documentation says: link plus exact quote.
4. What the log shows versus what the system expected.
5. Why that is wrong.
6. What exactly to fix.
No "možno", no "prípadne skúsiť X", no unverified alternatives, no unrelated mentions. Research and reasoning stay in the chat. Use `/jira-comment`.

## Worklogs (výkaz)
Final form, confirmed 2026-10-05:
- Impersonal noun form: "Overenie v kóde, kam aplikácia ukladá...", "Príprava...", "Oprava...", "Presun...". Not "sme", not "som", not infinitive.
- One or two short sentences per entry. Continuous sentences, no bullets, no leading dashes, so it pastes directly.
- Function names and project terms instead of descriptions.
- No routine steps (publish to mavenLocal, docs update, build) and no "oprava X" for small parts of a bigger change.
- When shortening, keep every factual point, drop only detail (e.g. listing error types).
- Only real, verifiable work. A security ticket with no work done gets an honest status, never a completion text.
Use `/worklog`.

## Documents for colleagues (analyst, PM, developers)
1. Their terminology, not a paraphrase.
2. No illustrative examples ("klient, ktorý appku otvára raz za mesiac..."). State what is missing and what must be done.
3. Do not frame things as hard blockers when they are not ("SDK to nevie" is wrong when we write the SDK; the question is where the logic lives).
4. Never sound like we do not understand our own code: first say what a thing does and why we use it, then the open question.
5. Short sentences, two to four per point, no evaluative phrases ("klient si nič nevšimne").
Check each paragraph: would someone who actually works on the project write it this way?

## Bug reports
Only bugs. No "overené bez chyby", observations, overview tables or "neotestované" sections.
- For the developer: per bug the symptom, cause, proposed fix, and whether it is app or backend.
- For the tester: steps, actual result, expected result. No code. Leave out uncertain items that are not app bugs.
- The full state (what is OK, what is untested) goes only into an internal status file for the user.
- Before calling something a regression, compare with main / the previous release.
Use `/bug-report`.

## Technical documentation (SDK docs, guides)
- Positive framing: describe the mechanism that exists, then the caveat. Never open with "There is no X".
- No invented examples or field names that the payload does not contain. No endpoint names in client-facing docs when the client forbids sharing them.
