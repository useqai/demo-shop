#!/bin/bash
# stop.sh — Stop all DemoShop services

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "Stopping DemoShop services..."

# Kill by saved PIDs
if [ -f logs/pids ]; then
  while read -r pid; do
    if kill -0 "$pid" 2>/dev/null; then
      kill -9 "$pid" 2>/dev/null && echo "  Stopped PID $pid"
    fi
  done < logs/pids
  rm -f logs/pids
fi

# Force-kill anything still on the service ports (catches orphaned processes)
for port in 3000 3001 3002 3003 8080; do
  pids=$(lsof -ti :$port 2>/dev/null)
  if [ -n "$pids" ]; then
    kill -9 $pids 2>/dev/null && echo "  Cleared port $port (PIDs $pids)"
  fi
done

# Wait for ports to fully release
sleep 1

echo "Done."
