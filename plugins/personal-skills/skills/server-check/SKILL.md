---
name: server-check
description: Read-only health snapshot of the Balansee production server over SSH (container status, restarts/OOM, recent errors, env var presence, memory/disk). Use when the user says "check the server", "server-check", "skontroluj server", "skontroluj kontajnery/backend/ai-module", "co je na serveri", or asks why prod misbehaves, instead of asking them to paste docker ps/logs output.
---

# Server check - Balansee production

Read-only, through Claude's own restricted key. Server facts: `G:/personal-projects/tremko/ai-logic-claude-context/contexts/personal/balansee/infra.md`.

## Rules
- Alias **`balansee-readonly`** from `~/.ssh/config`: Claude's own key, forced on the server to `/usr/local/bin/claude-readonly.sh` (source: `remote/claude-readonly.sh` next to this file). It can only run `check` and `logs <service> [n]`; any other command is refused by the server.
- The user's full-access alias `balansee-prod-new` (root, Hetzner, stack in `/opt/Balansee-INFRA`) has no allow rule: use it only for a concrete fix the user approved, showing the exact command first. Never use the dead alias `balansee-server`. Never read key files.
- No restart, `up -d`, prune, edits or SQL writes without the user's go.
- Never print env values or tokens. If the connection fails, say so; do not guess credentials. If `balansee-readonly` is not set up yet, tell the user the setup steps (below) instead of falling back to the full-access alias.

## Run
```bash
ssh balansee-readonly check
ssh balansee-readonly logs backend 300     # services: backend ai-module ntf-module audit-module keycloak; max 1000 lines
```

## One-time setup (the user does it)
1. Key `~/.ssh/balansee_claude_agent` (ed25519, exists or `ssh-keygen -t ed25519 -f ~/.ssh/balansee_claude_agent -C claude-agent`).
2. On the server: copy `remote/claude-readonly.sh` to `/usr/local/bin/claude-readonly.sh`, `chmod 755`, and add to `/root/.ssh/authorized_keys`:
   `command="/usr/local/bin/claude-readonly.sh",no-port-forwarding,no-X11-forwarding,no-agent-forwarding,no-pty <public key>`
3. In `~/.ssh/config`: `Host balansee-readonly` with the same `HostName` and `User` as `balansee-prod-new`, `IdentityFile ~/.ssh/balansee_claude_agent`, `IdentitiesOnly yes`.
4. Allow rule `Bash(ssh balansee-readonly *)` in the user settings.

## Report
Summarize, do not dump raw output:
- containers not `Up`, restarting, or `OOMKilled=true`
- env vars `MISSING`
- error lines worth attention (group repeats, name the service)
- memory or disk that looks tight
If all is healthy, say so in one line. Fixes go through the normal rules: show the exact command, wait for the go. Note that watchtower does not re-read env; env changes need `cd /opt/Balansee-INFRA && docker compose up -d <service>`.
