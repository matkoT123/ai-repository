# Known React projects

Facts collected from the real code. Re-check `package.json` before relying on versions.

## ProfesionalsFE (personal, Andrej Razus, `G:/personal-projects/razus/professionals/ProfesionalsFE`)

- Next.js 16.0 App Router, React 19.2, React Compiler on (`reactCompiler: true`), TypeScript strict, Tailwind 4 (no config file, `@import "tailwindcss"`), `lucide-react` icons, eslint 9 flat config with `eslint-config-next` core-web-vitals + typescript. Package manager pnpm (`pnpm dev|build|lint`), path alias `@/` = project root.
- Folders at root (no `src/`): `app/`, `components/{layout,home,profile,editor,ui,common}`, `lib/` (`utils.ts` with a simple `cn`, `authStore.ts`, `profileStore.ts`, `mockProfile.ts`), `types/profile.ts`.
- Style: default exports, `type Props = {...}`, PascalCase files, Slovak UI copy and some Slovak comments, `params: Promise<...>` awaited in pages, `notFound()` for missing data, `next/font/google` (Inter + Cormorant Garamond) as CSS variables.
- Colors: CSS vars as RGB channels in `app/globals.css` (`--bg-main: 14 14 17`) used as `bg-[rgb(var(--bg-main))]`. Stay consistent in existing files; if introducing `@theme` tokens, do it as a deliberate, agreed change.
- State: mock auth in `localStorage` (`lm_session`) + `lm_authchange` window event; profile editor keeps draft in page state and passes `draft` + `onChange(patch)` to section components. Backend integration points are documented in its `CLAUDE.md`.
- No tests yet. Known debts: unlinked labels, hardcoded hex in `Button`, client-side-only guards, duplicated `@layer base`.

## personal-website-o-mne (personal, `G:/personal-projects/tremko/personal-website-o-mne`)

- Vite 5 + React 18, plain JSX (no TS), no router, single page of section components (`Hero`, `About`, `Experience`, ...), i18n via `src/i18n/content.js` + `LanguageContext.jsx`, CSS in `src/index.css`. Public site: no client names (see core identity rule).

## Other

No other React/Next projects found under `G:/personal-projects`, `D:/ACONSULTING_PROJECTS`, `C:/PROJECTS` (checked package.json up to depth 5).
