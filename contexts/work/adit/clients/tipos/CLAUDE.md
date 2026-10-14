# TIPOS - Microsoft 365 / SharePoint / Fabric consulting

Consulting engagement for TIPOS (Slovak national lottery company, about 179 employees) through Adit (A Consulting). No code. Scope still being defined (as of 2026-07-30).

## Status
Active (pre-contract scoping). Target from the client: vendor and working Fabric setup by August 2026.

## Paths
- `G:/nogames/TIPOS-aconsulting-office/TIPOS/kontext.md` - scope summary (Slovak)
- `G:/nogames/TIPOS-aconsulting-office/materials/` - `sumar.docx` (meeting summary), `03_Analyzy_a_vystupy_k_TODO.docx` (pricing, licensing, legal), `06_Certifikacie_a_kurzy_2026-07-30.docx` (cert roadmap), `07_Realizacne_postupy_a_checklisty.docx` (execution runbook, a plan for later), `TIPOS-sprava.docx` (central data warehouse report)
- Memory (source of truth for details, read it): `C:/Users/marti/.claude/projects/G--nogames-TIPOS-aconsulting-office/memory/MEMORY.md`

## Scope (four projects)
- A - Fabric initial setup + IT training. Priority 1, can run in parallel with B. Not building the reporting layer.
- B - M365 audit incl. security (groups, rights, sign-in) > recommendations > configuration > handover. Security policy writing is hourly, outside the offer.
- C - SharePoint Online as storage and intranet replacement (replaces mapped drive F:).
- D - usage strategy + small per-department workshops. Quote hourly or per MD, never per workshop.
- Separate deliverable: `TIPOS-sprava.docx`, case for a central hybrid data lake/warehouse over vendor systems (eBet, Sportradar, Aurora/IGT, internal ERP, CRM ...). The user calls this the main project.

## Key constraints
- Gambling/betting systems and primary betting data stay out of M365/SharePoint/Fabric by law (zakon 30/2019). Fabric pilot uses only aggregated, non-personal or test data.
- NIS2 does not bind TIPOS directly; the binding framework is its ISO/IEC 27001:2022 certification (valid to 2029-02-19).
- Below Fabric F64 every Power BI creator and viewer needs Pro, so Pro licences beat F64 at TIPOS's size.
- Keep summaries of the runbook material high-level unless asked.

## DP-600 self-study
The user is learning Fabric from zero (free MS Learn Fabric path > DP-900 > DP-600). Trigger "pokracujeme na DP-600": screenshot + Slovak translation + explanation loop with TIPOS analogies. Current position changes every session, always read:
- `C:/Users/marti/.claude/projects/G--nogames-TIPOS-aconsulting-office/memory/project_dp600_learning_progress.md`
- `C:/Users/marti/.claude/projects/G--nogames-TIPOS-aconsulting-office/memory/feedback_dp600_teaching_format.md`

Hands-on labs run in the `aconsulting.sk` tenant (workspace TIPOS-DEMO, Fabric trial capacity).

## People
karci - client relationship, cert recommendations.

## Open questions
Price and scope per phase, timeline, who needs which certification before kickoff.
