# CHATBOT - company AI assistant

Adit internal product concept: an AI assistant that learns from internal documents and websites (RAG) and answers employee questions. Built on the MODULES platform.

## Status
Inactive. Last commit 2025-10-17 (Vladimir Jurenka). Development 2025-07 to 2025-10. Jira prefix `CHATBOT-`.

## Paths
- `D:/ACONSULTING_PROJECTS/CHATBOT/chatbot-be`

## Repo
- `https://git.adit.sk/modules/chatbot-be.git` (never push). Contributors: Tremko (58), Jurenka (51 + 23), David Gandi (28).
- Frontend `chatbot-fe` only as an image in `MODULES/stack`.

## Stack
- Java 23, Spring Boot 3.4.1 (web + webflux), Spring Security, PostgreSQL + Flyway, MapStruct, Lombok, springdoc.
- LangChain4j with OpenAI (`gpt-4o` chat, `text-embedding-3-large` embeddings), Elasticsearch 8.13 as vector store, document parsers: jsoup (web pages), PDFBox, Apache POI.
- Local infra via `compose.yaml`: Postgres, RabbitMQ, Redis, Elasticsearch.

## Architecture
- Controllers: Chat, Knowledge, Training, Reports.
- Services: `Assistant` (LangChain4j AI service), `ConversationService`, `PersistentChatMemoryStore` (chat memory in DB), `DocumentUploadService`, `KnowledgeService`, `TrainingService` + `TrainingStatusSyncProcessor`, `ReportsService` (token cost tracking via `cost-per-input-token`/`cost-per-output-token` config).
- Users and groups come from uaa-be (common-be User payload carries GROUP ids, CHATBOT-42) - knowledge access can be scoped per group.

## Build / run
`compose.bat`/`compose.sh` for infra, then run the Spring Boot app. OpenAPI client for doc-be from `api/doc-be.yaml`.

## Security notes
- secret present in `chatbot-be/src/main/resources/application.yaml` (literal `api-key`, likely an OpenAI key, plus DB passwords). Recommend rotation if the repo was shared.
- Postgres and Elastic passwords in `chatbot-be/compose.yaml`.
