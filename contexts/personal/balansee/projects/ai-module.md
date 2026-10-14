# ai-module (balansee-ai)

All OpenAI usage of the platform: transaction categorization (heuristic > Qdrant vector > gpt-4o-mini, learns only from GPT answers), goal names, bank statement extraction, one-off completions per purpose, the mascot chat with RAG and quotas, Qdrant vector cleanup on purge. Only called by the backend over `/internal/**`; there is no FE-facing API any more (old `/chat` and `/conversations` deleted in BSEE-128).

- Path `C:/SZABOPROJECTS/Balansee-be/ai-module`, origin `gitlab.com/balansee/backend/balansee-ai`, branch `main`. Prod `ai.balansee.sk`, port 8081, DB `balansee_ai`.
- Memory: `C:/Users/marti/.claude/projects/C--SZABOPROJECTS-Balansee-be-ai-module/memory/` (mostly 2026-07, partly stale) plus the backend memory, which holds the current AI state: `project_bsee79_ai_dedup.md`, `project_bsee128_chat_merge_waiting_jakub.md`, `project_ai_module_docker_lombok_config.md`, `project_ai_token_tracking_todo.md`, `project_privacy_hardening.md`.

## Stack
Spring Boot 3.5.6, Java 21, LangChain4j 1.4 (integration modules use the `-beta` version scheme, e.g. `1.4.0-beta10`; a plain `1.4.0` pin breaks CI), Qdrant (client 1.13 vs server 1.9 warning is known), Flyway, Keycloak JWT. groupId `com.balansee.be`, package `com.balansee.ai`. Build `mvn -B package -DskipTests`.

## Endpoints (all internal, `azp` = `balansee-service`)
`/internal/categorize/batch` (max 1000 tx, 413 above), `/internal/goal/generate-name`, `/internal/statements/extract` (chunked, max 300k chars), `/internal/completions` (`CompletionPurpose` with token caps), `/internal/assistant/chat` (plan check via backend, `ChatUsage` monthly quota, 429 when exhausted, history kept by the client and trimmed to 20, system role dropped, PII sanitized), `DELETE /internal/users/{keycloakId}/data` (purge), `/admin/rag/ingest`.

## Durable gotchas
- `lombok.config` must be copied in the Dockerfile (`COPY pom.xml lombok.config ./`). Without it `@Qualifier` on final fields is lost in CI only, and models get mixed up or the app does not start.
- Needs `BACKEND_BASE_URL=http://backend:8080/balansee` (context path) for plan checks.
- JSON mode: `responseFormat(ResponseFormat.JSON)`, not the String `"json_object"` (which does nothing and returns fenced JSON > 502). `JsonReplies.unwrap` stays as a safety net.
- Qdrant response DTOs need `@JsonIgnoreProperties(ignoreUnknown = true)`; derived `long deleteBy...` returns null, use `@Modifying @Query`.
- Startup init that depends on Qdrant runs as `ApplicationRunner`, not `@PostConstruct`. Treat 409 on collection creation as success.
- Privacy (BSEE-60): `PiiSanitizer` masks IBAN, e-mail, payment symbols, long numbers before embeddings and prompts; RAG knowledge base is curated docs only, never user transactions; vectors hold only embedding plus category, owner = Keycloak id.
- Token usage is not tracked (`ChatUsage` counts messages only); the user wants it later (memory `project_ai_token_tracking_todo.md`).
- Style per `feedback_coding_style.md` = core style; the reference project `D:/ACONSULTING_PROJECTS/CHATBOT/chatbot-be` is for patterns only, never connected.
