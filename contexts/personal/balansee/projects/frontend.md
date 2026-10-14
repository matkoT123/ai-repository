# Balansee-FE (Angular web)

Web app at `balansee.sk`: landing and registration, onboarding (quick/full modes), dashboard, transactions, goals, debts, monthly and long-term plans, AI assistant, notifications inbox, financial academy (gamified), settings, account deletion. Jakub's repo; the user got access 2026-10-07 for testing-phase fixes. A mobile iOS app also exists (FE commits mention iOS content export and tab bar); its repo is not on disk.

- Path `G:/personal-projects/szabo/Balansee-FE`, origin `gitlab.com/balansee/balansee-fe` (not under `backend/`), branch `main`. Feature branches are merged except `chore/academy-export-android`.
- Memory: none of its own yet; backend memory `project_testing_phase.md` holds the FE-related findings.
- Context kit: `.claude/` = Jakub's SATO kit (`integrations.md` > SATO kit). Conventions to follow: `.claude/work/analyze/conventions.md` (and `architecture.md`, `api-state.md`, `troubleshooting.md` when relevant).

## Stack
Angular 19 standalone components, SSR (`@angular/ssr` + Express, Node 20, port 4000), PrimeNG 21 + Angular Material 19 + Tailwind 4, keycloak-angular 19 / keycloak-js 26, ngx-translate (sk/en, fallback sk), Chart.js, Firebase (web push), Phosphor icons. Environments in `src/environments/` (`environment.ts`, `.local.ts`, `.prod.ts`); API base `https://api.balansee.sk/balansee`.

- Build before commit: `npm run build` (CI runs `npm install --legacy-peer-deps` and `npm run build -- --configuration=production` in Docker). Dev server `npm run dev` (port 4200) only when the user asks; testing normally runs against prod `balansee.sk` via Claude in Chrome.
- Conventions (Jakub's): selectors without `app-` prefix, `inject()` not constructor injection, private services, one `*.api.service.ts` per resource in `core/api/`, `Observable<T>` returns, commits in conventional style.

## Durable facts
- Testing phase: web first via Claude in Chrome, mobile later. Bugs found are fixed in FE or BE; scenarios are written against real FE screens.
- Known findings from 2026-10-07: N-01 web assistant called the deleted ai-module `/chat` (must use BE `/ai-chat/message`); `registration-pending` (409) has no FE translation; dev screen `/dev/registration-codes` relies on the open `/registration-code/generate` endpoint (must be closed before launch). Check Confluence "Testovacie scenáre" for current status.
- The FE should treat `403 ai-chat-quota-exceeded` and `plan-feature-not-available` from `/ai-chat` (Jakub was to be informed).
- Do not edit `.claude/` SATO files unless asked; they are Jakub's.
