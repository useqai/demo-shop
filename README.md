# DemoShop — Local Microservices Demo

A simplified e-commerce microservices demo inspired by [GCP Online Boutique](https://github.com/GoogleCloudPlatform/microservices-demo). Runs entirely locally without Docker. Uses Next.js, Node.js/Express, and Java/Spring Boot with Supabase (PostgreSQL) as the database.

## Architecture

```
Browser
  └─→ frontend          (Next.js, port 3000)
        ├─→ product-catalog-svc  (Node/Express, port 3001)
        ├─→ cart-svc             (Node/Express, port 3002)
        └─→ checkout-svc         (Java/Spring Boot, port 8080)
                ├─→ cart-svc     (GET cart, DELETE cart)
                └─→ payment-svc  (Node/Express, port 3003)
```

## Services

| Service | Tech | Port | Responsibility |
|---|---|---|---|
| `frontend` | Next.js | 3000 | E-commerce UI |
| `product-catalog-svc` | Node.js/Express | 3001 | Product listings & search |
| `cart-svc` | Node.js/Express | 3002 | Shopping cart |
| `checkout-svc` | Java/Spring Boot | 8080 | Order orchestration |
| `payment-svc` | Node.js/Express | 3003 | Mock payment processing |

## Prerequisites

- Node.js 18+
- Java 17+ (no Maven install needed — `./mvnw` downloads it automatically)
- A [Supabase](https://supabase.com) project (free tier works)

## Setup

### 1. Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `db/schema.sql`
3. Then run `db/seed.sql` to populate sample products
4. Note your project URL and keys from **Settings → API**

### 2. Environment Variables

Copy `.env.example` to `.env` in each service directory and fill in your Supabase credentials.

For `checkout-svc`, also copy `src/main/resources/application.properties.example` to `application.properties`.

### 3. Run All Services

```bash
./start.sh        # starts all 5 services in the background
./stop.sh         # stops them all
```

Logs go to `logs/<service>.log`. The checkout service takes ~60s on first run (Maven download + compile).

```bash
tail -f logs/checkout-svc.log   # watch checkout-svc startup
tail -f logs/frontend.log       # watch frontend startup
```

Or run each service manually in separate terminals:

```bash
cd product-catalog-svc && npm install && npm run dev   # :3001
cd cart-svc            && npm install && npm run dev   # :3002
cd payment-svc         && npm install && npm run dev   # :3003
cd checkout-svc        && ./mvnw spring-boot:run       # :8080
cd frontend            && npm install && npm run dev   # :3000
```

Visit [http://localhost:3000](http://localhost:3000)

## Building for Production

**Node.js services** — no build step; `node index.js` runs them directly.

**Frontend:**
```bash
cd frontend && npm run build && npm start
```

**Checkout service** — build a self-contained JAR:
```bash
cd checkout-svc && ./mvnw package -DskipTests
java -jar target/checkout-svc-1.0.0.jar
```

## User Flow

1. Browse products on the home page
2. Click a product to see details → Add to cart
3. View cart → adjust quantities
4. Checkout → enter email + shipping address → Place order
5. See order confirmation with transaction ID
