# Cunikova - Meetnity (personal side deal)

Client: Cunikova. Product: Meetnity, a two-sided marketplace for event venues. Our role: **mobile apps only (Android + iOS)** plus co-design of the API contract. Two developers with their own firms (the user and a colleague). Status 2026-10-10: **pre-sales / estimate phase, no code, no contract.**

## Paths
- `G:/personal-projects/cunikova/meetnity` (no git). Detailed project context in Slovak: `meetnity/CLAUDE.md` (read it first, this card only summarises).
- Working docs: `NACENENIE.md` (scope and pricing), `INVENTAR-FIGMA.md` (screen inventory), `API-AUDIT.md` (checklist for the client's developer), `OTAZKY-NA-KLIENTA.md` (business questions).
- Client materials: `materialy/` (monetisation plan, platform description, VOP, privacy and cookie policies as .docx, Figma PDF exports).
- PDF generator: `pdf/` (`theme.py`, `render.py`, `build.py`), reproduces the colleague's ReportLab PDF; output goes to `*_v2.pdf`, the original stays untouched.
- Memory: `~/.claude/projects/G--personal-projects-cunikova-meetnity/memory`. The old `G--personal-projects-cunikova-shopify` and `-meetnity-materialy` dirs hold only transcripts (folder was renamed from `shopify`).

## Business context
- Venue receives a lead without contact data, accepts or declines; contact unlocks and the venue pays only on acceptance (pay-per-accepted-lead 7 / 12 / 22 EUR by event size), plus profile boost subscriptions and prepaid credit packages.
- Client's own developer builds web, backend and admin; **none of it is finished** ("a few weeks", plan for 6 to 10). Figma (view-only) has desktop and 375 px mobile versions of every screen.
- Main risk: building the app against an unfinished backend. Fixed price only after the API contract and Figma are frozen; otherwise time and material.
- Open product decision: which app goes first (customer vs venue). Venue needs push for new leads; customer may be served by mobile web.

## Estimates (do not send without resolving the conflict)
| Source | Scope | MD |
|---|---|---|
| Own `NACENENIE.md` / `INVENTAR-FIGMA.md` | Variant A customer app | 146 (109 after MVP cut) |
| Own | Variant B both sides | 215 (internal with AI assistance about 155) |
| Own | Phase 0 API contract + scope freeze (mandatory, paid) | 5-8 |
| Colleague's PDF (2026-09-21), React Native / Expo | Both roles, both platforms | 87-128 with working API, 103-151 without |

The colleague's PDF is roughly half of the own estimate, omits phase 0, store release and localisation, and silently decides "one app with both roles". Target rate 50-60 EUR/h; pricing tables and the offer structure are in `NACENENIE.md`.

## Branding
Offer documents are signed **TwinCode s.r.o.** (from the colleague's PDF metadata), while `meetnity/CLAUDE.md` says there is no shared brand. Unconfirmed: ask before using the name in any new output.

## Writing rules for client documents
- Slovak. No em or en dashes, also not in ranges or as minus; rephrase the sentence instead of swapping the character; `>` instead of arrows. Base rule: [response-style.md](../../../core/rules/response-style.md); the stricter document variant is in memory `typografia-bez-pomlciek.md`.
- After every document edit, scan the output for dashes, minus signs and arrows before reporting done.

## Legal sensitivity (flagged, not decided)
This is paid IT services (programming, analysis) for a third party while the A Consulting framework contract with exclusivity runs (see [me/CLAUDE.md](../me/CLAUDE.md) and [identity.md](../../../core/rules/identity.md)). Signing, invoicing or delivering under the user's name or company before the contract ends may breach it (10k EUR penalty per breach). Do not resolve this in Claude; raise it whenever an offer, contract, invoice or start date comes up.

## Git
No repo yet. If one is created, follow the personal push rule in [git-safety.md](../../../core/rules/git-safety.md) and confirm the remote first (no known host).

Open questions: [open-questions.md](open-questions.md).
