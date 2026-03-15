#!/bin/bash
# start-prod.sh — Start all DemoShop services using production builds
# Run ./build.sh first to produce the artifacts.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

mkdir -p logs

# --- Preflight checks ---
missing=0
for svc in product-catalog-svc cart-svc payment-svc frontend; do
  if [ ! -f "$svc/.env" ]; then
    echo "  Missing: $svc/.env  (copy from $svc/.env.example)"
    missing=1
  fi
done
if [ ! -f "checkout-svc/src/main/resources/application.properties" ]; then
  echo "  Missing: checkout-svc/src/main/resources/application.properties"
  missing=1
fi
if [ ! -f "checkout-svc/target/checkout-svc-1.0.0.jar" ]; then
  echo "  Missing: checkout-svc/target/checkout-svc-1.0.0.jar — run ./build.sh first"
  missing=1
fi
if [ ! -d "frontend/dist" ]; then
  echo "  Missing: frontend/dist — run ./build.sh first"
  missing=1
fi
if [ $missing -eq 1 ]; then
  echo ""
  echo "Fix the issues above, then re-run ./start-prod.sh"
  exit 1
fi

# --- Clear any lingering processes on our ports ---
for port in 3000 3001 3002 3003 8080; do
  pids=$(lsof -ti :$port 2>/dev/null) || true
  if [ -n "$pids" ]; then
    echo "  Clearing port $port (PIDs $pids)..."
    kill -9 $pids 2>/dev/null || true
  fi
done
sleep 1

echo "Starting DemoShop (production)..."
echo ""

> logs/pids

start_node() {
  local name="$1"
  local dir="$2"
  local port="$3"
  echo "  [$name] starting on :$port → logs/$name.log"
  (cd "$dir" && node index.js) > "logs/$name.log" 2>&1 &
  echo $! >> logs/pids
}

start_node "product-catalog-svc" "product-catalog-svc" 3001
start_node "cart-svc"             "cart-svc"             3002
start_node "payment-svc"          "payment-svc"          3003

echo "  [checkout-svc] starting on :8080 → logs/checkout-svc.log"
(cd checkout-svc && java -jar target/checkout-svc-1.0.0.jar \
  --spring.config.location=src/main/resources/application.properties) \
  > logs/checkout-svc.log 2>&1 &
echo $! >> logs/pids

echo "  [frontend] starting on :3000 → logs/frontend.log"
(cd frontend && npm start) > logs/frontend.log 2>&1 &
echo $! >> logs/pids

echo ""
echo "All services started. PIDs saved to logs/pids"
echo "  Frontend: http://localhost:3000"
echo ""
echo "  Give checkout-svc ~15s to fully start"
echo "  Tail logs:  tail -f logs/<service>.log"
echo "  Stop all:   ./stop.sh"
