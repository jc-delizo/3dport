#!/usr/bin/env bash
# Four sandboxes, one per signature theme, same source on different ports.
# VITE_FORCE_THEME pins each port's opening theme (dev-only, see ThemeContext).
#   start:  scripts/theme-sandboxes.sh start
#   stop:   scripts/theme-sandboxes.sh stop
set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOGDIR="${SANDBOX_LOGDIR:-/tmp/3dport-sandboxes}"
PIDFILE="$LOGDIR/pids"
THEMES=("order:5181" "throughput:5182" "signal:5183" "atrium:5184")

start() {
  mkdir -p "$LOGDIR"; : > "$PIDFILE"
  cd "$ROOT" || exit 1
  for entry in "${THEMES[@]}"; do
    theme="${entry%%:*}"; port="${entry##*:}"
    VITE_FORCE_THEME="$theme" nohup npx vite \
      --host 0.0.0.0 --port "$port" --strictPort --base / \
      > "$LOGDIR/$theme.log" 2>&1 &
    echo "$! $theme $port" >> "$PIDFILE"
    echo "started $theme on :$port (pid $!)"
  done
}

stop() {
  [ -f "$PIDFILE" ] || { echo "no pidfile at $PIDFILE"; exit 0; }
  while read -r pid theme port; do
    if kill "$pid" 2>/dev/null; then echo "stopped $theme :$port (pid $pid)"
    else echo "$theme :$port (pid $pid) was not running"; fi
  done < "$PIDFILE"
  rm -f "$PIDFILE"
}

case "${1:-start}" in
  start) start ;;
  stop) stop ;;
  *) echo "usage: $0 {start|stop}"; exit 1 ;;
esac
