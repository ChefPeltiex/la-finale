# Base44 Dev Environment

## What this is

The main application lives in `peltiez/` — a React 18 + Vite 6 frontend with an Express API backend. The repo root contains other ancillary directories (docs, scripts, sub-projects) that are not part of the running app.

## Running the app

```bash
docker compose -f docker-compose.base44.yml up -d
```

- **Frontend**: Vite dev server on port 5173 (mapped to host port 3000)
- **Backend**: Express API on port 8787 (internal, proxied via Vite's `/api` proxy)
- Both run in a single container via `concurrently`
- Dependencies installed with `npm ci --legacy-peer-deps` on container startup
- `node_modules` lives in a named Docker volume (`peltiez_node_modules`)

## Architecture

- Vite dev server serves the React app and proxies `/api/*` requests to the Express backend on localhost:8787
- The Express server (`peltiez/server/index.js`) provides health, atlas, CRM, and Stripe endpoints
- All environment variables (Stripe keys, Resend, etc.) are **optional** — the app boots without them; payment/email features simply show disabled states

## Health checks

- Frontend: `GET http://localhost:5173/` (Vite dev server)
- API: `GET http://localhost:8787/api/health` → `{"ok":true,...}`

## Vite host allowlist

The compose passes `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` (set by the platform) so Vite 6.1+ accepts the preview proxy's Host header. The `--host 0.0.0.0` CLI flag overrides the config's `127.0.0.1` bind so the container is reachable.

## Secrets

No secrets are required to boot. Stripe (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`) and Resend API keys are optional — they enable payments and welcome emails but are not needed for the app to run.

## Verification commands (inside peltiez/)

```bash
npm run verify      # lint + typecheck + build
npm run dev         # frontend only
npm run dev:stack   # frontend + API (what compose runs)
```
