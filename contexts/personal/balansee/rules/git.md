# Git for Balansee

Base rules: `core/rules/git-safety.md` and `contexts/personal/CLAUDE.md` (diff first, explicit "ok/pushni" in this conversation, then commit and push in one go). This file adds what is specific to Balansee.

- The older memory rule "fix small findings directly, commit and push" (`feedback_fix_small_findings_directly.md`) is **retired**. Small fixes also wait for the user's explicit go.
- The only remote in every repo is `origin` on `gitlab.com/balansee/*`. Push with plain `git push origin main`, show the URL first. No other host or remote exists for Balansee; do not mention or restore the old pre-GitLab CI/registry setup. If a stray extra remote appears, report it in one line and ask before removing.

## Remotes
| Folder | origin | Default branch |
|---|---|---|
| `Balansee-be` | `https://gitlab.com/balansee/backend/balansee-be.git` | `main` |
| `ai-module` | `https://gitlab.com/balansee/backend/balansee-ai.git` | `main` |
| `notification-module` | `https://gitlab.com/balansee/backend/balansee-ntf.git` | `main` |
| `balansee-audit` | `https://gitlab.com/balansee/backend/balansee-audit.git` | `main` |
| `keycloak-audit-listener` | `https://gitlab.com/balansee/backend/balansee-keycloak-audit.git` | `main` |
| `Balansee-FE` | `https://gitlab.com/balansee/balansee-fe.git` (not under `backend/`) | `main` |
| server `/opt/Balansee-INFRA` | `https://gitlab.com/balansee/balansee-infra.git` (not under `backend/`) | `main` |

Folder and repo names differ (`ai-module` = `balansee-ai`, `notification-module` = `balansee-ntf`). Paths `backend/ai-module` and `backend/notification-module` do not exist. Old pre-subgroup URLs still redirect; do not use them.

## Container registry paths
| Service | Image |
|---|---|
| backend | `registry.gitlab.com/balansee/backend/balansee-be:latest` |
| ai-module | `registry.gitlab.com/balansee/backend/balansee-ai:latest` |
| ntf-module | `registry.gitlab.com/balansee/backend/balansee-ntf:latest` |
| audit-module | `registry.gitlab.com/balansee/backend/balansee-audit:latest` |
| frontend | `registry.gitlab.com/balansee/balansee-fe:latest` (no `backend/`, do not "fix" it) |

Moving or renaming a GitLab repo changes its registry path. Then also update the `image:` lines in prod `compose.yaml`, otherwise watchtower silently stops deploying (happened for 9 days to 3 weeks, fixed 2026-09-15). The listener has no image; its JAR is deployed by hand (`projects/keycloak.md`).

## Build before commit
- Backend repos: `mvn -B package -DskipTests` in the module. This is exactly what the Dockerfile runs in CI, so it is the local stand-in for the pipeline.
- Frontend: `npm run build`.
- A config file that affects compilation must also be copied in the Dockerfile (ai-module `lombok.config` lesson, `projects/ai-module.md`). A local green build does not catch that.
- Pipeline state cannot be checked from this machine (no `glab`, no GitLab token). Never say "pipeline passed"; say the identical build passed locally and link `https://gitlab.com/balansee/<path>/-/pipelines`.

## CI and deploy
1. Push to `main` > GitLab CI builds the Docker image (`docker build` with `mvn -B package -DskipTests` inside) and pushes `:latest` to the registry. Other branches build nothing.
2. Watchtower on prod polls every 300 s and recreates label-enabled containers with the new image, so **push = deploy within about 5 minutes**.
3. Watchtower reuses the running container's config. It does **not** re-read `compose.yaml` or `.env`. When a change adds or changes an env var, run `docker compose up -d <service>` in `/opt/Balansee-INFRA` after the image is pulled (state-changing, needs the user's go), then check `docker inspect` env.
4. Because push = deploy, any manual DB step (widening a CHECK constraint, data fix) must run **before** `git push`, not "before deploy" (`projects/backend.md` > DB pitfalls).
5. Backend also runs the `confluence-docs` CI job on `main` when entity/docgen files change (`integrations.md`).

## Commits, branches, MRs
- `main` is protected against force push. An amended pushed commit cannot be re-pushed; write the message right the first time.
- The user's backend commits: `BSEE-<n> - <Slovak summary>` (several tickets: `BSEE-128, BSEE-127 - ...`); without a ticket, a plain Slovak summary. Never guess the ticket number.
- Jakub's commits use conventional style (`feat(onboarding): ...`, `fix(web): ...`). The FE SATO config declares `[{ticket}]{title}` and branches `feature/{ticket}-{title}` / `fix/{ticket}-{title}`, MRs as draft to `main` with squash. In the FE repo follow Jakub's conventions; ask if unsure.
- The user works directly on `main` in backend repos. Feature branches exist mostly from Jakub (`feature/onboarding-modes`, `fix/profile-completion`).
- Commit identity: repos are configured with `tremko@adit.sk` (open question on switching to the personal gmail, see `open-questions.md`). Infra repo on the server has no identity; commit with `git -c user.name='Martin Tremko' -c user.email=<same as previous commits>`.
- Never commit `claude-materials/`, `.env`, `.claude/settings.local.json` (all gitignored in the backend repos; check `git status` anyway).

## Infra repo push (from the server)
See `infra.md` > Infra repo. Short version: no git credentials on the server, a one-off `GIT_ASKPASS` script with the registry PAT, deleted right after; never write the token into `.git/config` or `.git-credentials`; normalize CRLF before committing.
