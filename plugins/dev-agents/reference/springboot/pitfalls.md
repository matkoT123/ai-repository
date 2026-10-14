# Spring Boot pitfalls (learned in real projects)

Each item: symptom > root cause > rule.

## Schema: Hibernate ddl-auto=update + Flyway hybrids

- **New primitive field, column silently missing.** Hibernate makes `boolean`/`int` NOT NULL; `@Builder.Default` is Java-only, so the ALTER has no DEFAULT and fails on existing rows. Postgres rolls the DDL back, the app still starts, every query then fails "column does not exist". Rule: `@Column(nullable = false, columnDefinition = "boolean default false")` or a wrapper type, or a Flyway migration with backfill. Verify in `information_schema.columns`.
- **New enum value crashes inserts.** For `@Enumerated(STRING)` Hibernate creates `CHECK (col IN (...))` only when it creates the table; `update` never widens it. If a startup runner seeds the new value, the container logs "Started" and dies seconds later (crash loop). Rule: migration that drops and re-adds the constraint on every table with that column; verify with `pg_get_constraintdef(oid) LIKE '%NEW_VALUE%'`. Prefer generic types (e.g. `SYSTEM_ALERT` with its own text) over adding enum values for every variant.
- **Flyway runs before Hibernate.** A migration targeting a table Hibernate will create later sees nothing, its IF EXISTS guards skip, Flyway marks it applied, it never runs again. Rule: tables Hibernate creates get indexes via `@Table(indexes = ...)`; Flyway only alters existing tables. Greenfield: let Flyway own the schema and set `ddl-auto: validate`.
- **Edited migration = crash loop.** Checksum covers the whole file (even a comment) > `FlywayValidateException` on next boot. Always a new higher version. Never set `validateOnMigrate(false)` to hide it.
- **Fresh DB fails.** V1 and init SQL that assume Hibernate-created tables fail on an empty volume. Guard them (`IF EXISTS` in a `DO $$` block) or make Flyway create everything.
- **Defensive migration shape on hybrid projects:** `DO $$ BEGIN IF NOT EXISTS (select from information_schema.tables ...) THEN RETURN; END IF; ALTER TABLE ... ADD COLUMN IF NOT EXISTS ...; UPDATE ... backfill; ALTER ... SET DEFAULT ...; ALTER ... SET NOT NULL; END $$;`
- **Auto-deploy ordering.** With Watchtower, push = deploy within minutes. Apply constraint/DB changes the new code needs before pushing.
- **psql over ssh heredoc** (`ssh host "psql <<'SQL' ... SQL"`) sends empty input and does nothing. Use multiple `-c` and verify the result.

## JPA

- Switching `@ManyToOne` to LAZY changes no schema but breaks code that walks relations outside a session (schedulers, async) with `LazyInitializationException`. Load inside a transaction or pass loaded data.
- `@Data` on entities: equals/hashCode/toString over lazy relations triggers loads and recursion. Use `@Getter @Setter`.
- Derived `long deleteByX(...)` can return null > NPE > 500. Use `@Modifying @Query`.
- HQL `sum()` over an int column returns `Long`.
- Soft delete + unique email: `existsByEmailAndDeletedFalse` passes, the INSERT still hits the unique index > 500. Check the same way the constraint does (or make the index partial `WHERE deleted = false`).
- `Map.of()` rejects null values (NPE). Use `LinkedHashMap` when values may be null.
- GDPR erasure: explicit bulk JPQL in fixed FK order instead of cascades; parse the statements at startup so a renamed entity breaks boot, not the nightly job. Delete in external services first (they are keyed by ids on the local row), notification data last.
- Encrypted columns: `AttributeConverter` with AES-GCM and random IV per value, key from env with no default. Losing the key loses the data - check for existing rows before enabling.

## Proxies, transactions, async

- `@Async`, `@Transactional(REQUIRES_NEW)`, Resilience4j `@Retry` work only through the proxy. Self-invocation silently runs sync / joins the caller transaction. Split into a separate bean (e.g. `AuditClient` facade > `AuditDispatcher` with `@Async("auditExecutor")`).
- `@Scheduled` does nothing without `@EnableScheduling`; `@PreAuthorize` does nothing without `@EnableMethodSecurity`. Grep for the enabling annotation.
- Async threads have no request or security context: capture user, IP (X-Forwarded-For > X-Real-IP > remoteAddr behind a proxy) before handoff, or use `DelegatingSecurityContextAsyncTaskExecutor`.
- Credit / quota ledgers: REQUIRED not REQUIRES_NEW (otherwise the credit survives a failed grant and can be replayed); pessimistic lock at the start of read-then-write; reserve > call external > confirm/release.
- Never hold a DB transaction across slow external calls (LLM, vector DB, bank APIs).
- Batch schedulers: per-item try/catch and transaction, so one bad item does not roll back all.

## Config, startup, kill switches

- Risky features behind flags defaulting to false. Quotas: never `null` meaning "unlimited" by accident.
- `@PostConstruct` is too early for "ensure external resource exists"; use `ApplicationRunner`, idempotent (409 = success when several services share the resource).
- Seed/sample runners: catch, log, keep booting (fail-open) - a crash here becomes a restart loop under an auto-updater.
- Fire-and-forget pipelines need two health signals: failure counter and liveness probe; alert on transition, re-alert at most every N hours, send recovery.

## Build, Docker, deploy

- `lombok.config` (`lombok.copyableAnnotations += org.springframework.beans.factory.annotation.Qualifier`) must be COPYed into the Docker build context. Without it `@Qualifier` on final fields under `@RequiredArgsConstructor` is dropped only in CI, and Spring injects the `@Primary` bean silently. Local `mvn package` does not catch it.
- `@SuperBuilder`/`@Builder` with field initializers and no `@Builder.Default` > defaults become 0/null (real bug: ListRequest pageSize).
- DTO without getters/setters + MapStruct > empty generated method > PATCH silently no-op.
- Watchtower recreates containers from their existing config; it never re-reads compose/.env and never creates new services. After env changes run `docker compose up -d <svc>` and check `docker inspect`. Renaming a GitLab repo changes the registry path and silently stops deploys.
- Keep Keycloak (and its SPI jars) out of auto-update; re-verify SPI compatibility on every Keycloak upgrade.
- CRLF from Windows uploads shows whole files changed: add `.gitattributes`.
- Internal-only services: no reverse-proxy exposure; test from inside the network (`docker run --rm --network X curlimages/curl ...`).

## Security

- Systemic IDOR is the most common bug: every `/{id}` needs an ownership check, lists need user scope, never trust a client-sent userId.
- Default `JwtAuthenticationConverter` ignores Keycloak roles; roles in code are dead weight if registration never assigns them.
- Catch-all handler must not echo `ex.getMessage()`. Build JSON with ObjectMapper, URLs with `UriComponentsBuilder`, never string interpolation.
- Never log full JWTs (revocation checks are a classic place this happens).
- Keycloak event listener SPI: whitelist event types, skip CLIENT_LOGIN (it loops on the listener's own token fetch), never forward admin-event representations (may contain secrets). Audit snapshots built field by field, never by reflection.
- Realm exports mask secrets; re-applying needs an idempotent init step.
- Webhook/reward callbacks: verify signature over the raw query string (deserializing first breaks it), server-issued nonce, 200 on duplicates, 400 on bad signature.

## LLM integrations (langchain4j)

- Integration modules use `-betaN` versions; check the BOM before pinning.
- JSON mode needs `ResponseFormat.JSON`, not the string "json_object"; still strip code fences defensively.
