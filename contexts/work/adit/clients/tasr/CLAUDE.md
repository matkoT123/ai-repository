# TASR - news agency (teraz.sk, social aggregator)

Client: TASR (Tlacova agentura Slovenskej republiky). Main product is the teraz.sk website; Adit also built a social-media aggregator and evaluated a Telegram integration.

## Status
Intermittently active. teraz-sk-web last commit 2026-01-14 (G: copy, jakubnovota); root context `G:/nogames/TASR/CLAUDE.md` updated 2026-09-17 with VPN/UAT access. social-agg last commit 2025-07-21.

## Paths
- `G:/nogames/TASR/git-projects/teraz-sk-web` - current working copy (has a root `CLAUDE.md` with VPN and UAT details)
- `D:/ACONSULTING_PROJECTS/TASR/teraz-sk-web` - older copy (last 2025-07-24)
- `D:/ACONSULTING_PROJECTS/TASR/social-agg`
- `D:/ACONSULTING_PROJECTS/TASR/telegramApi` - TDLib proof of concept (no git)
- `D:/ACONSULTING_PROJECTS/TASR/tdlight/tdlight-java` - clone of upstream github.com/tdlight-team/tdlight-java (reference only)
- `D:/ACONSULTING_PROJECTS/TASR/Estimates/TelegramIntegrationEstimate.xlsx`

## Repos (never push)
| Repo | Remote | Notes |
|---|---|---|
| teraz-sk-web | `https://git.adit.sk/tasr/teraz-sk-web.git` | PHP, own framework, Composer (phpdotenv, hydrahon query builder, kreait/firebase-php), Solr, Firebase, Docker (`startDocker.sh`, `docker/`), Cypress tests, TypeScript part in `typescript/`, gulp/webpack. Since 2013. Branches `master`, `production`. |
| social-agg | `https://git.adit.sk/tasr/social-agg.git` | Java 21, Spring Boot 3.3.2, PostgreSQL + Flyway, WebFlux client, scheduled jobs pulling Facebook/Instagram (Graph API) posts of influencers. Contributors: Jurenka, Filip Zemla, Tremko. |

## Telegram integration (estimate stage)
`telegramApi` = plain Java 23 + tdlight-java listeners (`TelegramRunner`, multi-channel listeners) reading channel posts. Estimate: scheduled `TelegramJobRunner` that reads new messages, deduplicates and stores them in social-agg's DB.

## Access
- TASR company VPN (FortiClient VPN-only, SSL-VPN, full tunnel) for UAT servers; details and caution in `G:/nogames/TASR/CLAUDE.md`. Credentials from karci via Slack DM, stored in 1Password.
- Jira prefix `TASR-`, branches `feature/TASR-xxx`, `issue/TASR-xxx_desc`.
- Team: jakub-novota, vjurenka, Tibor Lapos, Martin Tremko, moravec. karci handles access.

## Security notes
- secret present in `D:/ACONSULTING_PROJECTS/TASR/social-agg/Readme.md` (tracked in git: Facebook app client secret and user/page access tokens in URLs). Recommend rotation and removal.
- teraz-sk-web tracks `.env.production`, `docker/.env` and Apple push certificates under `essentials/certificates/2017/*.pem` (both copies).
- `TASR/telegramApi/tdlib-session/` holds a logged-in Telegram session (`td.binlog`, sqlite DBs).
