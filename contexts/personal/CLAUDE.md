# Personal context

Loaded in every personal root. Adds to `core/`; the area files (`balansee/`, `andrej-razus/`, `cunikova/`, `me/`, `hobby/`) add project specifics.

## Git
- Push targets: `gitlab.com/balansee/*`, `github.com/matkoT123/*`, `github.com/ARULIFE/*`. Anything else: stop and ask (`core/rules/git-safety.md`).
- Show the diff, wait. After the user explicitly confirms ("ok", "yes", "pushni"), commit and push in one go. No exceptions for "small fixes".
- Build before commit. The guard plugin also builds Maven/npm repos before every push and blocks on failure.
- Commit identity: as configured in each repo; ask if it is unclear which identity (personal gmail vs `tremko@adit.sk`) the project uses.

## Integrations
- The claude.ai Atlassian connector is allowed here (Balansee site only). Never use it for work instances.
- Production servers are reached only through SSH aliases from `~/.ssh/config`; never read key files.

## Legal
The user works under an A Consulting exclusivity contract. Side projects with third parties (Andrej Razus, Cunikova) may touch it: flag commercial commitments, do not decide them. Never name A Consulting clients in anything public.

## Areas
| Area | Context |
|---|---|
| Balansee (with Jakub Szabo) | `balansee/CLAUDE.md` |
| Andrej Razus (Professionals, Vendy, ucimInak) | `andrej-razus/CLAUDE.md` |
| Cunikova (meetnity) | `cunikova/CLAUDE.md` |
| Own (CV, website, interview) | `me/CLAUDE.md` |
| Hobby (free time) | `hobby/CLAUDE.md` |
