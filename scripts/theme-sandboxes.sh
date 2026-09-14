#!/usr/bin/env bash
# Atrium sandbox — the surviving signature theme (Order/Throughput/Signal were
# reviewed live and dropped; see docs/decision-log.md 2026-09-14).
# VITE_FORCE_THEME pins the opening theme (dev-only, see ThemeContext).
#   start:  scripts/theme-sandboxes.sh start
#   stop:   scripts/theme-sandboxes.sh stop
set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOGDIR="${SANDBOX_LOGDIR:-/tmp/3dport-sandboxes}"
PIDFILE="$LOGDIR/pids"
THEMES=("atrium:5184")

start() {
  mkdir -p "$LOGDIR"; : > "$PIDFILE"
  cd "$ROOT" || exit 1
  for entry in "${THEMES[@]}"; do
    theme="${entry%%:*}"; port="${entry##*:}"
    # setsid: npx wraps vite in a child, so killing the npx pid alone leaves
    # the server listening. A fresh process group lets stop() kill the tree.
    VITE_FORCE_THEME="$theme" setsid nohup npx vite \
      --host 0.0.0.0 --port "$port" --strictPort --base / \
      > "$LOGDIR/$theme.log" 2>&1 &
    echo "$! $theme $port" >> "$PIDFILE"
    echo "started $theme on :$port (pgid $!)"
  done
}

stop() {
  [ -f "$PIDFILE" ] || { echo "no pidfile at $PIDFILE"; exit 0; }
  while read -r pid theme port; do
    if kill -- "-$pid" 2>/dev/null || kill "$pid" 2>/dev/null; then
      echo "stopped $theme :$port (pgid $pid)"
    else
      echo "$theme :$port (pgid $pid) was not running"
    fi
  done < "$PIDFILE"
  rm -f "$PIDFILE"
}

case "${1:-start}" in
  start) start ;;
  stop) stop ;;
  *) echo "usage: $0 {start|stop}"; exit 1 ;;
esac
