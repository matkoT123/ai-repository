# Open questions and pending actions

All questions from 2026-10-09 were answered on 2026-10-10 and applied to the files in this repo.

## Pending actions outside this repo (run together with `install.ps1 -Apply`, they touch live project context)
1. jt-mtoken: remove `@claude-materials/conversation_log.md` from `Projects/jt-mtoken-android/CLAUDE.md` (untracked file). Extract durable facts from both log copies into topic memory files first; keep both logs as frozen history.
2. VSZP: retire memory `feedback_context_file.md` (append to `context.txt`), replace with a pointer to `contexts/work/adit/rules/workflow.md`.
3. VSZP: fix memory `user_profile.md` URL `mobilny-vszp` > `mobilny-vyvoj`.
4. VSZP: remove the ZPIS-90284 default-ticket note from memory (no default tickets).
5. Replace with one-line pointers to `contexts/work/adit/rules/git.md`: jt-mtoken `feedback_no_git_commands_execution.md`, VSZP `feedback_git_workflow.md`.

## User actions
6. Tokens in remote URLs (GitLab PATs): `Projects/VSZP/vszp-android` (origin + adit), `Projects/sezam-ai/sezam-marketplace` (origin). Switch to Git Credential Manager, then revoke and recreate the PATs. Commands are prepared on request.
