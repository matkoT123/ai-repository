# balansee-audit (audit-module)

Audit trail service (BSEE-94): who did what to which entity, when and from where, from all producers (`BE`, `AI`, `NTF`, `AUDIT`, `KEYCLOAK`). Write `POST /internal/events`, read `GET /internal/events` and `/internal/events/{id}`, all internal-only (service token, `azp` = `balansee-service`) because there is no admin role. Nightly retention purge (`app.retention.months`, default 24).

- Path `C:/SZABOPROJECTS/Balansee-be/balansee-audit`, origin `gitlab.com/balansee/backend/balansee-audit`, branch `main`. Prod internal only `audit-module:8083`, DB `balansee_audit`.
- Memory: backend memory `project_bsee46_bsee94_certifications_audit.md` (history, Confluence "Audit Module" 80609282), `project_ops_alerting_audit_health.md`. Repo `README.md` is accurate on the model.
- Reference implementation (not Balansee code): `D:/ACONSULTING_PROJECTS/MODULES/audit/audit-be` (work root, read-only); its memory only points back here.

## Stack
Spring Boot 3.5.6, Java 21, JPA. Package `com.balansee.audit`. Build `mvn -B package -DskipTests`. `AUDIT_SAMPLE_ENABLED` (sample events) defaults off.

## Durable facts
- `entityId` is text (producers mix UUID and Long ids, Keycloak has its own). `sourceModule` is a closed enum; a new producer needs a new constant.
- Redaction is the caller's job; never send passwords, secrets or full PII in `previousState`/`newState`.
- Audit writes are fire-and-forget at the producers, so a broken audit module is silent; the backend's audit health check emails `ALERTS_EMAIL`.
- Audit records survive account deletion on purpose (GDPR legal basis).
