# Open questions - Andrej Razus

1. **Personal skolky.** `identity.md` lists skolky under Andrej, but only the Adit copy (`D:/ACONSULTING_PROJECTS/skolky`) exists. Is there a personal skolky project at all? Proposed: drop skolky from Andrej's list in `identity.md` until a personal repo appears; keep it in work/adit.
2. **Vendy canonical copy.** Confirm `ARULIFE/VendyBE` as canonical and the two non-git copies as read-only references. Proposed: yes; optionally archive `vendy-server-martins-version` later.
3. **Vendy Angular client.** `vendy-client` lives only in the zip extract. Should it get its own ARULIFE repo? Proposed: ask Andrej; until then leave untouched.
4. **ucimInak remote.** It is under `matkoT123`, the other Andrej projects under `ARULIFE`. Intentional? Proposed: keep on matkoT123 until Andrej asks for a transfer.
5. **Embedded tokens.** Rewrite the ProfesionalsFE and ucimInak remotes to plain HTTPS with a credential helper and revoke both tokens. Proposed: yes, user does it (token rotation needs GitHub UI).
6. **FE auth model.** ProfesionalsFE CLAUDE.md plans cookie auth, BE is Keycloak JWT. Proposed: FE uses Keycloak (OIDC PKCE) and Bearer tokens; update the FE CLAUDE.md when integration starts.
7. **Task tracker.** Are the `86c...` ids ClickUp? Is there a link or MCP to read them? Proposed: record the workspace URL here once confirmed.
8. **Exclusivity.** These are side projects while the A Consulting exclusivity clause runs (see [me/CLAUDE.md](../me/CLAUDE.md)). Paid or unpaid? Flag only, not decided.
