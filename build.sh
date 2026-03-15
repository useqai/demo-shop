#!/bin/bash
# build.sh — Build all DemoShop services into production artifacts
#
# Artifacts produced:
#   frontend/dist/           Next.js production build with source maps (run with: npm start)
#   checkout-svc/target/     checkout-svc-1.0.0.jar  (run with: java -jar)
#   Node.js services         no build step needed; run with: node index.js

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "Building DemoShop..."
echo ""

# --- frontend ---
echo "[1/3] Building frontend (Vite + React)..."
(cd frontend && npm install --silent && npm run build)
echo "      Done → frontend/dist/"
echo ""

# --- checkout-svc ---
echo "[2/3] Building checkout-svc (Spring Boot JAR)..."
echo "      (This may take a few minutes on first run)"
(cd checkout-svc && ./mvnw -q package -DskipTests)
echo "      Done → checkout-svc/target/checkout-svc-1.0.0.jar"
echo ""

# --- Node.js services ---
echo "[3/3] Installing Node.js service dependencies..."
(cd product-catalog-svc && npm install --silent)
(cd cart-svc            && npm install --silent)
(cd payment-svc         && npm install --silent)
echo "      Done (no build step needed for Node.js services)"
echo ""

echo "Build complete. Run ./start-prod.sh to start all services."
