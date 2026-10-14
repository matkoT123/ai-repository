# notification-module (balansee-ntf)

Notifications for the platform: web inbox (FE calls it directly with the user JWT), email via `info@twincode.sk`, push via Firebase FCM, SMS via BulkGate. Backend creates notifications through `POST /internal/notifications` (service token, `azp` check). No local user table: the Keycloak `sub` is the user id everywhere, so callers pass `User.keycloakId`, never the internal BE id.

- Path `C:/SZABOPROJECTS/Balansee-be/notification-module`, origin `gitlab.com/balansee/backend/balansee-ntf`, branch `main`. Prod `ntf.balansee.sk`, port 8082, DB `balansee_ntf`.
- Memory: backend memory `project_notification_module_plan.md` (v1 plan, partly stale), `project_ops_alerting_audit_health.md`, `project_ddl_auto_enum_check_constraint.md`, `project_bsee117_account_deletion.md`. Repo `README.md` describes v1 and is partly outdated on channels.

## Stack
Spring Boot 3.5.6, Java 21, Spring Mail, Firebase Admin SDK, JPA with ddl-auto. Package `com.balansee.ntf`. Build `mvn -B package -DskipTests`. Env: `MAIL_USERNAME`, `MAIL_PASSWORD`, `FIREBASE_CREDENTIALS_BASE64`, `BULKGATE_*`.

## Durable gotchas
- `NotificationType` is duplicated in Balansee-be; keep both enums identical. A new type needs the CHECK constraints on `notification.type` **and** `notification_template.type` widened in `balansee_ntf` before `git push`; otherwise `NotificationTemplateSample` seeding crash-loops the container (`backend.md` > DB pitfalls).
- `SYSTEM_ALERT` is generic on purpose (text in `component`/`message`) so new alert kinds need no new enum value. Alerts use the zero UUID as userId.
- `ACCOUNT_DELETION_REQUESTED` goes by email only (the user can no longer log in to see the inbox).
- Templates are upserted at startup; placeholders `{{variable}}` must match the `data` map the backend sends.
- CORS is configured for direct browser calls from the FE.
