# Balansee-be (main backend)

The core API: users and registration, bank connections and transactions, financial profile, goals, debts, monthly plans and reviews, plans/subscriptions, onboarding, account deletion. Calls ai-module for all AI, ntf-module for notifications, audit-module for the audit trail. The user owns most of it; Jakub also commits (onboarding, admin settings, the `/ai-chat` context code).

- Path `C:/SZABOPROJECTS/Balansee-be/Balansee-be`, origin `gitlab.com/balansee/backend/balansee-be`, branch `main`.
- Memory: `C:/Users/marti/.claude/projects/C--SZABOPROJECTS-Balansee-be-Balansee-be/memory/` (index `MEMORY.md`). Current-state anchors: `project_testing_phase.md`, `project_security_audit_2026_10.md`, `project_bsee96_payments_status.md`, `project_bsee75_rewarded_ads.md`, `project_audit_remediation.md` (trigger "Balansee BE code audit follow-up").

## Stack
- Spring Boot 3.5.6, **Java 21** in `pom.xml` (Dockerfile uses a Temurin 23 image; the repo `CLAUDE.md` saying Java 23 is stale). Maven, Lombok, MapStruct, Spring Data JPA, Flyway, OAuth2 resource server (Keycloak), PDFBox 3 (`Loader.loadPDF()`, not `PDDocument.load()`), Apache POI.
- Packages `com.balansee.be`: `controller`, `service` (`tink`, `yapily`, `keycloak`, `imports`, `notification`, `alert`, ...), `repository`, `data/entity|model|enums`, `mapper`, `configuration`, `exception` (`AppException` + `Error` enum), `shedule` (sic), `sample` (ApplicationRunners), `docgen`.
- Profiles: default = local (`localhost:45448` DB, `localhost:8088` Keycloak, never run it); `dev` = prod container profile with context path `/balansee` and **security enabled**.
- Build: `mvn -B package -DskipTests`. There is a small `src/test` tree; no real test setup.

## Stale facts in the repo CLAUDE.md (tracked, shared with Jakub)
Java 23, old CI section, "security disabled in dev", roles `USER/ADMIN/PREMIUM`, "AI categorization via OpenAI in BE". All outdated; it also @imports `claude-materials/conversation_log.md` (retired habit, see `open-questions.md`). Do not edit the file without asking.

## Durable facts
- **No roles.** The Keycloak client-role system was removed 2026-08-18. Plans live in `UserSubscription` (FREE created at registration) and `PlanService`; `getEffectivePlan` handles expiry. Endpoints `/plan`, `/plan/{plan}/permissions`, `/plan/me`, `/internal/plan/{keycloakId}/permissions`. No path to a paid plan yet (BSEE-96).
- Internal endpoints (`/internal/**`) accept only client-credentials tokens whose `azp` is `balansee-service`.
- Registration: `PendingRegistration` (one form > phone OTP > account), gated by a QR registration code. Phone not unique. Password in `PendingRegistration` encrypted, cleanup job every 15 min.
- `BankConnection` access/refresh tokens encrypted (`EncryptedStringConverter`, AES-GCM, `ENCRYPTION_KEY`).
- Account deletion (BSEE-117/118): `DELETE /user/me` > 30-day grace > nightly purge 03:30 UTC across BE, ai-module, ntf, Keycloak, Qdrant. `UserDataEraser` = bulk JPQL in fixed order, separate bean for `REQUIRES_NEW`; statements parsed at startup so an entity rename breaks boot. Audit records are deliberately kept (GDPR art. 17(3)(b)(e)). Restore via `POST /internal/user/{keycloakId}/restore`. Any new entity with a user FK must be added to the eraser.
- AI: `OpenAiService` is a thin wrapper over `AiModuleClient` (categorize batch, goal name, statement extraction, completions by purpose). Domain prompts for plan/review/risk/goal intent stay in BE on purpose (data locality). `/ai-chat/message` collects context and calls ai-module; maps 429 > 403 `ai-chat-quota-exceeded`, 403 > `plan-feature-not-available`.
- `NotificationClient` and `AuditClient` are fire-and-forget; `OpsAlertService` emails `ALERTS_EMAIL` when audit delivery fails (15 min check, re-alert max every 6 h). `NotificationType` is mirrored by hand in ntf-module; keep both in sync.
- Shared Qdrant: any service creating a collection must treat HTTP 409 as success (2026-07 crash-loop).

## DB pitfalls (ddl-auto=update plus Flyway)
1. Flyway runs **before** Hibernate. A migration touching a table Hibernate creates in the same deploy runs against nothing and is never repeated. New table indexes go on the entity (`@Table(indexes = ...)`); Flyway only for existing tables (columns, FKs, backfill, CHECK constraints).
2. Never edit an applied migration, not even a comment: checksum mismatch > `FlywayValidateException` > crash-loop. Fix with a new migration.
3. New primitive field on a table with rows needs `@Column(columnDefinition = "boolean default false")` (or similar), otherwise the ALTER fails silently and the column never exists.
4. A new value in an `@Enumerated(STRING)` enum never widens the existing Postgres CHECK constraint. Widen it manually (`ALTER TABLE ... DROP/ADD CONSTRAINT`) **before `git push`**, because push = deploy. Applies to `notification.type` and `notification_template.type` in ntf (crash-loop on template seeding).
5. After deploy verify in Postgres and check `RestartCount`; a clean "Started" line proves nothing.

## Open
Testing phase findings (N-xx, B-xx on Confluence), closing `/registration-code/generate` before launch, payments, ads network, remaining audit follow-up items. Current state: memory files above.
