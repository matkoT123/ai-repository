---
name: server-check
description: Read-only health snapshot of the Balansee production server over SSH (container status, restarts/OOM, recent errors, env var presence, memory/disk). Use when the user says "check the server", "server-check", "skontroluj server", "skontroluj kontajnery/backend/ai-module", "co je na serveri", or asks why prod misbehaves, instead of asking them to paste docker ps/logs output.
---

# Server check - Balansee production

One SSH call, read-only. Server facts: `G:/personal-projects/tremko/ai-logic-claude-context/contexts/personal/balansee/infra.md`.

## Rules
- Alias **`balansee-prod-new`** from `~/.ssh/config` (root, Hetzner, stack in `/opt/Balansee-INFRA`). Never use the dead alias `balansee-server`. Never read key files.
- Read-only only: `docker ps/logs/inspect`, env **presence** checks, `free`, `df`. No restart, `up -d`, prune, edits or SQL writes; for those show the command and wait for the user's go.
- Never print env values or tokens. If the connection fails, say so; do not guess credentials.

## Run
```bash
ssh balansee-prod-new 'bash -s' << 'REMOTE'
echo "=== containers ==="
docker ps -a --filter "label=com.docker.compose.project=balansee" --format "table {{.Names}}\t{{.Status}}\t{{.Image}}"

for SVC in backend ai-module ntf-module audit-module keycloak; do
  C=$(docker ps -a --format '{{.Names}}' | grep -m1 -- "balansee-$SVC-" || true)
  [ -z "$C" ] && { echo; echo "!! $SVC: container not found"; continue; }
  echo; echo "=== $C ==="
  docker inspect "$C" --format 'State={{.State.Status}} RestartCount={{.RestartCount}} OOMKilled={{.State.OOMKilled}} StartedAt={{.State.StartedAt}}'
  echo "--- errors in last 300 log lines ---"
  docker logs "$C" --tail 300 2>&1 | grep -E "ERROR|Exception|Caused by" | tail -15
done

echo; echo "=== env presence (values never printed) ==="
check() { C=$(docker ps --format '{{.Names}}' | grep -m1 -- "balansee-$1-" || true); [ -z "$C" ] && return
  for V in $2; do docker exec "$C" sh -c "[ -n \"\$$V\" ]" && echo "$1 $V=set" || echo "$1 $V=MISSING"; done; }
check ai-module "OPENAI_API_KEY SPRING_DATASOURCE_URL"
check backend "SPRING_DATASOURCE_URL ENCRYPTION_KEY KEYCLOAK_SERVICE_CLIENT_SECRET"

echo; echo "=== host ==="
free -h; df -h / | tail -1
REMOTE
```

## Report
Summarize, do not dump raw output:
- containers not `Up`, restarting, or `OOMKilled=true`
- env vars `MISSING`
- error lines worth attention (group repeats, name the service)
- memory or disk that looks tight
If all is healthy, say so in one line. Fixes go through the normal rules: show the exact command, wait for the go. Note that watchtower does not re-read env; env changes need `cd /opt/Balansee-INFRA && docker compose up -d <service>`.
