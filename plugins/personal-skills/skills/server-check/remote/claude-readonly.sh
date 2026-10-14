#!/usr/bin/env bash
# Forced command for Claude's read-only SSH key on the Balansee production server.
# Install: /usr/local/bin/claude-readonly.sh (root:root, 0755) and in /root/.ssh/authorized_keys:
#   command="/usr/local/bin/claude-readonly.sh",no-port-forwarding,no-X11-forwarding,no-agent-forwarding,no-pty ssh-ed25519 AAAA... claude-agent@ai-module
# Whatever the client asks for arrives in SSH_ORIGINAL_COMMAND; only the actions below run.
#   check                 containers, restarts/OOM, recent errors, env presence, memory/disk
#   logs <service> [n]    last n (default 200, max 1000) log lines of one Balansee service
set -euo pipefail
set -f  # no globbing of client input

SERVICES="backend ai-module ntf-module audit-module keycloak"
read -r -a ARGS <<< "${SSH_ORIGINAL_COMMAND:-check}"
ACTION="${ARGS[0]:-check}"

container_of() { docker ps -a --format '{{.Names}}' | grep -m1 -- "balansee-$1-" || true; }

case "$ACTION" in
  check)
    echo "=== containers ==="
    docker ps -a --filter "label=com.docker.compose.project=balansee" --format "table {{.Names}}\t{{.Status}}\t{{.Image}}"
    for SVC in $SERVICES; do
      C=$(container_of "$SVC")
      [ -z "$C" ] && { echo; echo "!! $SVC: container not found"; continue; }
      echo; echo "=== $C ==="
      docker inspect "$C" --format 'State={{.State.Status}} RestartCount={{.RestartCount}} OOMKilled={{.State.OOMKilled}} StartedAt={{.State.StartedAt}}'
      echo "--- errors in last 300 log lines ---"
      docker logs "$C" --tail 300 2>&1 | grep -E "ERROR|Exception|Caused by" | tail -15 || true
    done
    echo; echo "=== env presence (values never printed) ==="
    check_env() {
      local C; C=$(docker ps --format '{{.Names}}' | grep -m1 -- "balansee-$1-" || true); [ -z "$C" ] && return 0
      for V in $2; do docker exec "$C" sh -c "[ -n \"\$$V\" ]" && echo "$1 $V=set" || echo "$1 $V=MISSING"; done
    }
    check_env ai-module "OPENAI_API_KEY SPRING_DATASOURCE_URL"
    check_env backend "SPRING_DATASOURCE_URL ENCRYPTION_KEY KEYCLOAK_SERVICE_CLIENT_SECRET"
    echo; echo "=== host ==="
    free -h; df -h / | tail -1
    ;;
  logs)
    SVC="${ARGS[1]:-}"; N="${ARGS[2]:-200}"
    [[ " $SERVICES " == *" $SVC "* ]] || { echo "unknown service '$SVC' (allowed: $SERVICES)"; exit 2; }
    [[ "$N" =~ ^[0-9]{1,4}$ ]] && [ "$N" -le 1000 ] || { echo "line count must be 1-1000"; exit 2; }
    C=$(container_of "$SVC"); [ -z "$C" ] && { echo "$SVC: container not found"; exit 1; }
    docker logs "$C" --tail "$N" 2>&1
    ;;
  *)
    echo "not allowed: read-only key supports only 'check' and 'logs <service> [n]'"; exit 2
    ;;
esac
