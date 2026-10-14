# Known Angular projects

Facts collected from the real code. Re-check `package.json` before relying on versions.

## Balansee-FE (personal, `G:/personal-projects/szabo/Balansee-FE`)

- Angular 19.2, standalone, SSR (`@angular/ssr` + Express, Heroku Node 20), zone.js with `provideZoneChangeDetection({ eventCoalescing: true })`.
- UI: PrimeNG 21 `unstyled: true` (global `src/styles/primeng.scss`) + Angular Material 19 (dialogs, snackbar) + Tailwind 4 via `@tailwindcss/postcss` (`@use 'tailwindcss'` in `styles.scss`). Tokens in `src/styles/colors.scss` as CSS vars. Icons: Phosphor (`ph`, `ph-fill` classes). Charts: Chart.js.
- Auth: Keycloak via custom `core/auth/keycloak-ssr.provider.ts` (init only in browser, `check-sso`, no keycloak-angular auto refresh; `SessionManagerService` handles expiry). `authGuard` uses `createAuthGuard`. `authInterceptor` adds Bearer only for known API hosts and only in browser.
- i18n: ngx-translate 17, `assets/i18n/sk.json` + `en.json`, fallback `sk`, keys `SECTION.KEY`.
- Structure: `core/api/<resource>.api.service.ts` + `core/api/models/api.models.ts`, `core/guards`, `core/services` (signal-based singletons like `ProfileService`), `core/layout`, `features/<feature>/`, `shared/{enum,interface,dialogs,util}`.
- Style: `inject()` everywhere, `standalone: true` written explicitly, selectors mostly `app-` (some legacy unprefixed: `dashboard`, `transaction-table`, `expenses-graph`). New control flow, `input()`/`output()` in newer code. OnPush only in about a third of components (academy feature is the model to copy). Components subscribe to one-shot HTTP calls directly with `{ next, error }`. Comments in Slovak.
- Patterns worth copying: route-level `providers` + `InjectionToken` with factory default (`ACADEMY_CONFIG`), `@Injectable()` feature store with private writable signal + readonly exposure, persistence behind a repository class, pure `*.model.ts` logic with `*.model.spec.ts`.
- Tests: Karma + Jasmine, only a few specs (pure model functions). `ng test --no-watch`.
- Context kit: `.claude/` (SATO Engine by Jakub Szabo): `work/analyze/conventions.md` is the binding doc, `standards/angular.md` is a generic template (ignore its medical examples and prefix advice when the code disagrees). Jira + GitLab, branch `feature/{ticket}-{title}`, commit `[{ticket}]{title}`.

## Legacy Angular (NgModule era)

| Project | Path | Version | Notes |
|---|---|---|---|
| bookadlo-frontend | `D:/ACONSULTING_PROJECTS/NEW_BOOKADLO2/bookadlo-frontend` | 13.0 | NgModules, Material 13 + moment adapter, `BaseComponent` abstract class with manual `Subscription`, constants files in `app/constants`, separate `pc/` and `mobile/` components |
| spisova_sluzba_fe (+ monorepo copies, camunda-engine-fe) | `C:/PROJECTS/ALFABASE/...`, `C:/PROJECTS/MonoRepo/149-monorepo/...` | 15.2 | NgModules, constructor DI, Bootstrap 4, ngx-translate 14, `angular-auth-oidc-client`, runtime config loaded via `APP_INITIALIZER` from `environment.configPath`, eslint 8 |

Rules: keep NgModule + constructor DI style, but type new DTOs, unsubscribe, and handle errors. Do not migrate to standalone/signals unless asked (offer `ng generate @angular/core:standalone` / control-flow migration as a separate task).

## sezam-asgui (work, Asseco SEZAM, Angular 19 multi-project)

- Library `fl-core` + customer projects `asseco`, `jtsk`, `jtcz`, `jtsk-imperson`, `jt-psd2`, `fl-client`. Legacy AngularJS lives in the same repo under `sezam-asgui/src/app`; never mix builds.
- Team skills: `G:/nogames/asseco-android/Projects/sezam-ai/sezam-marketplace/plugins/angular/skills/` (`code-review-angular`, `unit-tests-angular`). Adopted conventions: change in `fl-core` = check every variant; customer differences go to the variant project; every HTTP call has an error branch; no `any` toward backend contracts; tests in `fl-core` services (`npm run test-fl-core`), Karma + Jasmine only; say which variants were not built.
- Work repo: git push is never done by the agent (see core git-safety).
