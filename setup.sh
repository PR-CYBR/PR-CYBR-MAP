#!/usr/bin/env bash

#──────────────────────────────────────────────────────────────
# PR-CYBR-MAP – Interactive Setup Wizard
#──────────────────────────────────────────────────────────────
# Modes
#  1. Automations / AI-Agent (headless build + workflow dispatch)
#  2. Local Build          (serve site on host machine)
#  3. Docker Build         (containerised Option 2)
#  4. Cleanup & Uninstall  (revert everything)
#
# The script spawns three coordinated subshells:
#  ▸ wizard  – curses-style menu + progress meter
#  ▸ worker  – executes chosen option, logs to $LOGFILE
#  ▸ logger  – tails $LOGFILE for live feedback
#
# Designed for human, Codex, or CI use (non-interactive falls back
# to Option 1 when $CI==1 || $AUTO==1).
#
# Versioning:
# - v1.0.2
#──────────────────────────────────────────────────────────────

set -euo pipefail
IFS=$'\n\t'

### ───── constants ───────────────────────────────────────────
NODE_VERSION="20"
CONFIG_FILE="data/config.json"
CSS_IN="css/input.css"
CSS_OUT="css/output.css"
LOGFILE="$(mktemp)"
PORT=8080
DOCKER_IMG="prcybr-map:latest"

### ───── helpers ─────────────────────────────────────────────
need() { command -v "$1" >/dev/null 2>&1 || { echo "$1 not found"; exit 1; }; }
hr()   { printf '%*s\n' "$(tput cols)" | tr ' ' '─'; }
banner(){
  clear; hr
  printf "%s\n" "$(figlet -w $(tput cols) -f slant "PR-CYBR-MAP SETUP WIZARD" 2>/dev/null || echo "PR-CYBR-MAP SETUP WIZARD")"
  hr
}
progress(){ local p=$1 w=$(( $(tput cols) - 10 )); local f=$(( p*w/100 ))
            printf "\r["; printf "%*s" "$f" '' | tr ' ' '#'
            printf "%*s" "$((w-f))" '' | tr ' ' '-'; printf "] %3d%%" "$p"; }

### ───── worker functions ────────────────────────────────────
work_automations(){
  echo "[*] Running headless build…"
  corepack enable
  pnpm install --prefer-offline           # ← clean install
  pnpm run lint || true
  pnpm run test --if-present
  pnpm run build
}
work_local(){ work_automations; echo "[*] Serving on http://localhost:$PORT"; npx http-server -p "$PORT" . & }
work_docker(){
  echo "[*] Building Docker image $DOCKER_IMG"
  docker build -t "$DOCKER_IMG" .
  echo "[*] Running container (port $PORT)"
  docker run --rm -d -p "$PORT:$PORT" --name prcybr-map "$DOCKER_IMG"
}
work_cleanup(){
  echo "[*] Cleaning up…"
  pkill -f "http-server.*$PORT" 2>/dev/null || true
  docker rm -f prcybr-map 2>/dev/null || true
  docker rmi "$DOCKER_IMG" 2>/dev/null || true
  rm -rf node_modules out css/output.css "$LOGFILE"
}

### ───── main menu ───────────────────────────────────────────
menu(){
  banner
  cat <<EOF
  1) Automations / AI-Agent build
  2) Local Build & Serve
  3) Docker Build & Serve
  4) Cleanup & Uninstall
  q) Quit
EOF
  read -rp "Choose an option [1-4]: " CHOICE
}

### ───── orchestration ───────────────────────────────────────
main(){
  if [[ ${CI:-} == 1 || ${AUTO:-} == 1 ]]; then CHOICE=1; else menu; fi
  banner; echo "Logs → $LOGFILE"
  case "$CHOICE" in
    1|"") (work_automations) &>>"$LOGFILE" & ;;
    2)     (work_local)      &>>"$LOGFILE" & ;;
    3)     (work_docker)     &>>"$LOGFILE" & ;;
    4)     (work_cleanup)    &>>"$LOGFILE" & ;;
    q|Q)   exit 0 ;;
    *)     echo "Invalid option"; exit 1 ;;
  esac
  WORKER_PID=$!
  tail -f "$LOGFILE" & LOGGER_PID=$!
  for i in {0..100}; do progress "$i"; sleep 0.3; done &
  METER_PID=$!
  wait "$WORKER_PID"; kill "$LOGGER_PID" "$METER_PID" 2>/dev/null || true
  progress 100; echo -e "\nDone."
}

trap 'echo "Interrupted"; kill 0; exit 1' INT TERM
need jq; need curl; corepack enable >/dev/null
pnpm -v >/dev/null || { echo "pnpm missing"; exit 1; }
main
