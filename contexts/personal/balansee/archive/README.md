# Archive: stale dated memory files

These memory files hold dated status or superseded plans. Content is not copied here; open the file if the topic returns. Durable lessons were moved into the context files (column "Lesson").

Memory dirs: `BE` = `C:/Users/marti/.claude/projects/C--SZABOPROJECTS-Balansee-be-Balansee-be/memory/`, `AI` = `C:/Users/marti/.claude/projects/C--SZABOPROJECTS-Balansee-be-ai-module/memory/`.

| File | What it was | Lesson (now in) |
|---|---|---|
| `BE/project_overview.md` | Stack/CI overview from 2026-05, Java 23, old registry, Portainer recreate | Superseded (backend.md, rules/git.md) |
| `BE/project_features.md` | Feature list 2026-06 incl. removed roles and BE OpenAI services | Partly stale; PDFBox 3 API (backend.md) |
| `BE/project_pending.md` | 2FA, OpenAI fixes, constraint fix, AI docs task; all done | none |
| `BE/project_2fa_plan.md` | Keycloak TOTP plan, implemented | none |
| `BE/project_ai_module.md` | ai-module scaffold era, BSEE-56 phases | Privacy rules (ai-module.md) |
| `BE/project_ai_module_integration_status.md` | 2026-08-19 "no integration" state | Data locality decides what moves to ai-module (backend.md) |
| `BE/project_audit_remediation.md` | 2026-07 full BE audit, fixed/skipped/open list | Trigger "Balansee BE code audit follow-up"; one item at a time (CLAUDE.md) |
| `BE/project_bsee105_verification_tasks.md` | Email/phone verification, BulkGate signup, PendingRegistration rework | Test inbox = personal gmail; Keycloak admin API recipe (integrations.md, keycloak.md) |
| `BE/project_registration_code_qr.md` | QR registration codes BSEE-111/112/113 | Wrapped by PendingRegistration (backend.md) |
| `BE/project_db_encryption.md` | Field encryption rollout 2026-08-19 | Encryption facts (backend.md); file holds a secret value (infra.md > Security) |
| `BE/project_keycloak_deploy.md` | Proposed keycloak-init automation, never applied | Masked secrets after re-import (infra.md) |
| `BE/project_keycloak_roles_removed.md` | Role removal 2026-08-18 | No roles, plan via UserSubscription (backend.md, keycloak.md) |
| `BE/project_keycloak_audit_listener_pending.md` | Listener deployment 2026-09-14 | Deploy procedure (keycloak.md) |
| `BE/project_notification_module_plan.md` | ntf v1 plan, reference project analysis | keycloakId as user id (notification.md) |
| `BE/project_bsee46_bsee94_certifications_audit.md` | Certifications, audit trail build-out, ISO 27001 page | audit.md |
| `BE/project_bsee73_multi_bank_accounts.md` | Multi-account and internal transfers, deployed 2026-09-17 | Two Tink findings unverifiable (integrations.md) |
| `BE/project_bsee75_rewarded_ads.md` | Ads behind two switches, Flyway trap discovery | Flyway before Hibernate; Jira `adf` (backend.md, integrations.md) |
| `BE/project_bsee79_ai_dedup.md` | AI dedup BSEE-79/125/126, 2026-09-30 | JSON mode gotcha (ai-module.md) |
| `BE/project_bsee93_encryption_research_and_backups.md` | LUKS/backup research, live server audit 2026-09-06 | No backups, no disk encryption, deferred (infra.md) |
| `BE/project_bsee96_payments_status.md` | Payments state 2026-09-30 | Still current anchor for BSEE-96 |
| `BE/project_bsee117_account_deletion.md` | Account deletion 2026-09-14/16 | Eraser design (backend.md) |
| `BE/project_bsee128_chat_merge_waiting_jakub.md` | Chat merge, done 2026-10-01 | 429/403 mapping (backend.md) |
| `BE/project_ops_alerting_audit_health.md` | First ops alerting 2026-09-16 | backend.md, notification.md |
| `BE/project_confluence_docgen.md` | Docgen on the old CI 2026-07 | Now GitLab job (integrations.md) |
| `BE/project_prod_server.md` | Server move 2026-08-13 | Alias balansee-prod-new only (infra.md) |
| `BE/project_registry_path_after_subgroup_move.md` | Silent watchtower outage, fixed 2026-09-15 | rules/git.md |
| `BE/project_security_docs.md` | Confluence "Bezpečnosť aplikácie" versions | Page id (integrations.md) |
| `BE/project_privacy_hardening.md` | BSEE-60 five steps, done 2026-07-11 | ai-module.md, integrations.md |
| `BE/project_security_audit_2026_10.md` | Audit 2026-10-07, user's open list | Open rotations (infra.md > Security) |
| `BE/project_testing_phase.md` | Testing phase start, accounts, wipe 2026-10-07 | Active topic, keep in memory; holds test passwords pattern (infra.md > Security) |
| `BE/reference_confluence_access.md` | Connector failures and fix 2026-08 | integrations.md |
| `BE/reference_gitlab_pipeline_check.md` | No glab/token, local build stand-in | rules/git.md |
| `BE/feedback_fix_small_findings_directly.md` | Commit and push small fixes without asking | **Retired** by user decision (rules/git.md) |
| `BE/feedback_conversation_log.md` | Append session summaries to `claude-materials/conversation_log.md` | Superseded by curated memory (open-questions.md) |
| `BE/feedback_never_touch_github.md` | Remote cleanup 2026-09-14 | rules/git.md (single origin) |
| `BE/feedback_*` (others) | Push confirmation, summary, thin controllers, em dashes, scope, screenshots, save context, per-change approval, Jira/Confluence style, verify on prod | core rules, CLAUDE.md, integrations.md |
| `AI/project_infra.md` | Old server compose, new server plan 2026-07 | Hetzner vs AWS decision; file holds a secret value (infra.md > Security) |
| `AI/reference_server_ssh_access.md` | Old `claude-agent` access on the dead host | Read-only vs state-changing policy (infra.md) |
| `AI/project_session_2026-07-08_summary.md` | Multi-day debugging session | Watchtower env, Qdrant 409, LangChain4j beta versions (ai-module.md) |
| `AI/project_qdrant_coupling_incident.md` | Crash-loop 2026-07-07 | 409 = success (backend.md, ai-module.md) |
| `AI/project_balansee_ai_module.md` | Architecture 2026-07-02, old public endpoints | Superseded (ai-module.md) |
| `AI/reference_confluence_docs.md` | REST v1 push recipe | integrations.md fallback |
| `AI/reference_postman_balansee.md` | Postman IDs | integrations.md |
| `AI/user_martin.md`, `AI/feedback_coding_style.md`, `AI/reference_sibling_project.md` | Profile, style, sibling pointer | core identity and code style; CLAUDE.md |
