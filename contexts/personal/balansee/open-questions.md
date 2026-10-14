# Open questions (2026-10-10)

Each has a proposed answer. Nothing outside this repo was changed.

1. **Commit identity.** Balansee repos commit as `tremko@adit.sk` (repo config), core identity says personal projects use the personal gmail. Switch? *Proposal:* set repo-local `user.email` to the personal gmail in all 7 repos going forward, no history rewrite.
2. **`conversation_log.md` habit.** Memory `feedback_conversation_log.md` and the tracked `Balansee-be/CLAUDE.md` @import `claude-materials/conversation_log.md` and `chat_transcript.txt` (647+ lines, one matches secret patterns). *Proposal:* retire the habit, replace the memory file with a pointer to this context, remove both @imports from the repo CLAUDE.md (after asking Jakub, the file is tracked), keep the log as frozen history.
3. **Stale repo `Balansee-be/CLAUDE.md`.** *Proposal:* replace its content with a short stub pointing at the facts that are true (Java 21, GitLab CI, security on in `dev`, no roles, AI via ai-module); agree with Jakub since he uses it too.
4. **Retired memory rule.** *Proposal:* replace `feedback_fix_small_findings_directly.md` with a one-line pointer to `rules/git.md` so it cannot resurface.
5. **Leftover pre-GitLab workflow folders** in Balansee-be, ai-module and Balansee-FE (dead CI files). *Proposal:* delete them in one commit per repo after the user's go.
6. **Exposed secrets in local files** (list in `infra.md` > Security). *Proposal:* the user rotates first (Confluence token, prod DB password, OpenAI/Tink/Yapily/`balansee-service`), then Claude removes the values from the two `settings.local.json` files and the three memory files (replacing them with key names), and the user deletes or rewrites `C:/SZABOPROJECTS/Balansee-KEYCLOAK` (token in remote URL, tracked `.env`).
7. **`Balansee-KEYCLOAK` folder.** *Proposal:* archive it outside the roots or delete it locally; `balansee-infra` on the server is the source of truth.
8. **Local infra clone.** No Windows clone of `balansee-infra` exists, edits happen on prod. *Proposal:* keep it that way (user decision 2026-09), but add `.gitattributes` with `* text=auto eol=lf` on the server to end CRLF churn.
9. **Old `server-check` skill** at `~/.claude/skills/server-check/` still targets the dead host. *Proposal:* remove it once the `personal-skills` plugin with the new version is installed, so only one `server-check` exists.
10. **`personal-skills` plugin manifest.** This layer only adds `plugins/personal-skills/skills/server-check/`. *Proposal:* whoever owns `plugins/` adds `plugins/personal-skills/.claude-plugin/plugin.json` and the marketplace entry.
11. **Mobile app repo.** iOS app exists (FE commits, chat history kept on mobile) but no repo is on disk or documented. *Proposal:* ask Jakub for the repo URL and add `projects/mobile.md` only if the user will work on it.
12. **Keycloak `admin` realm role / `balansee-admin` client** added by Jakub (`e2f9b70`), admin settings dropped later (`3b41287`). *Proposal:* check on prod whether the client and role still exist; if unused, remove them in the security pass together with V2.
13. **Ai-module memory store** is mostly 2026-07 and stale. *Proposal:* trim it to a pointer file plus `project_qdrant_coupling_incident.md`; current AI state lives in the backend memory and `projects/ai-module.md`.
14. **Audit-fix deploy gaps.** keycloak-audit-listener `c5f56f6` not deployed; Qdrant/Traefik/Portainer public routes left to the user. *Proposal:* do them in one maintenance window with the user (listener JAR + compose route changes + `docker compose up -d`), verified via `/server-check`.
15. **Backups.** Deferred until real launch. *Proposal:* keep deferred, but re-raise automatically when the Tink contract is signed or the first real user registers.
