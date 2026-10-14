# Me - CV, website, interview prep, contract

The user's own career material. Root: `G:/personal-projects/tremko` (none of these folders is a git repo). Identity and emails: [identity.md](../../../core/rules/identity.md).

## Projects
| Item | Path | Notes |
|---|---|---|
| CV 2026 | `zivotopis_2026` | Source of truth: `src/cv_sk.html`, `src/cv_en.html` (+ `cv.css`, `photo.png`). PDFs `CV_sk.pdf` / `CV_en.pdf` via headless Chrome `--headless=new --no-pdf-header-footer --print-to-pdf`. Old `Zivotopis_2026.docx`. |
| Personal website | `personal-website-o-mne` | React 18 + Vite, SK/EN, all texts in `src/i18n/content.js`, tech tooltips in `src/i18n/techInfo.js`. Kept: main site (`src/components`, do not change) and the preferred `poster` variant (`/variants/poster/`). Not deployed; options in `DEPLOY.md` (static hosting, domain tied to own name or own s.r.o.). |
| Interview prep | `materialy-na-interview-studying` | PDFs (speech, Android experience, modules). Generator `make_docs.py` (`py -3 make_docs.py <speechOutDir> <prepDocxOutDir>`, python-docx), PDF via LibreOffice headless, run in foreground with a long timeout. Android prep state: memory `~/.claude/projects/G--nogames-asseco-android-Projects/memory/interview-prep-android.md`. |
| Profiles | LinkedIn, Pretlak, Profesia (SK + EN CV) | Synced to the CV on 2026-10-07/08. |

## Rules for this area
- **Never name A Consulting clients** in the CV, website, LinkedIn, Pretlak, Profesia or posts. Use the generic sector wording already in the CV (e.g. "mobile banking for Slovak and Czech banks", "health insurance company", "large state-owned infrastructure company"). Rule source: [identity.md](../../../core/rules/identity.md). A Consulting itself may be named.
- Interview prep may use real project names (private files), but say "I" only for work git confirms.
- Never save edits on Pretlak/LinkedIn without the user's review; never send applications or change Profesia CV visibility unless asked.
- Website design: no AI-generic look (grids, gradient orbs, marquees, pulsing badges, thin dividers, blue accents). Prefer bold type, solid colours, 2px borders, hard shadows.
- Balansee was temporarily removed from LinkedIn and Pretlak (2026-10-07). The exact original texts are in memory `G--personal-projects-tremko-zivotopis-2026/memory/balansee-removal-backup.md`; restore only when the user says "vrat balansee". CV and website still mention Balansee.

## Contract constraints (A Consulting)
Summary only, not legal advice. Details: memory `G--personal-projects-martin/memory/freelance-contract-exclusivity.md` (orphan dir from before the folder rename) and `G--personal-projects-tremko-zivotopis-2026/memory/contract-confidentiality-rules.md`.
- B2B (zivnost) framework contract with A Consulting: full exclusivity for IT services while it runs, 2-year non-solicit of their clients and staff after the end, confidentiality without time limit, 10 000 EUR penalty per breach, 90-day notice. The file `Ramcova zmluva - exkluzivita (1).docx` in the root is an unfilled 2023 template; the signed version was not reviewed.
- Freelance (Pretlak profile kept invisible) and invoicing planned only after the contract ends (target 2027). Website "available for freelance" texts conflict with this while it runs.
- Side projects (Balansee, Andrej Razus, Cunikova): flag commercial steps, do not decide. Owning a share is lower risk than personally delivering services. Recommend a lawyer for anything binding.

## Profesia CV API recipe
Profesia's SPA freezes browser automation; edit the CV through its internal REST API from `javascript_tool` instead. Endpoints, ids and pitfalls (PUT replaces whole arrays): memory `G--personal-projects-tremko/memory/profesia-cv-api.md`. Last state: `profesia-cv-state-2026-10.md`.

## Security and confidentiality notes
- `personal-website-o-mne/input-data.txt` contains real client names: never deploy or publish it; exclude it from any future git repo.
- Website `SITE.links` (LinkedIn, GitHub) are still placeholders.

Open questions: [open-questions.md](open-questions.md).
