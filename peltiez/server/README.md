# IGOR API (Stripe + CRM minimal)

## Local dev

1. À la racine du dépôt (`peltiez/`), créer **`.env.server`** à partir de **`.env.server.example`** et renseigner au minimum :
   - `STRIPE_SECRET_KEY` (si tu testes Stripe)
   - `PUBLIC_SITE_URL` (souvent `http://localhost:5173`)

2. Démarrer l’API (port **8787** par défaut) — une des commandes suivantes :

```bash
npm run dev:api
# équivalent :
npm run server
npm run backend
npm run start
```

3. Démarrer le frontend Vite (autre terminal), ou tout en un :

```bash
npm run dev
```

```bash
npm run dev:stack
```

Les appels du front à `/api/...` sont proxifiés vers `http://localhost:8787` (voir `vite.config.js`).

## CRM — leads (`/api/crm/lead`)

Les envois sont enregistrés en **NDJSON** dans `server/data/crm-leads.ndjson` (fichier **ignoré par Git**). Sauvegardez ce fichier dans vos backups ops si vous en faites un usage commercial (RGPD / consentement à documenter).

## Déployer (Vercel)

Le dépôt contient les handlers sous **`api/stripe/checkout.js`** et **`api/stripe/webhook.js`** (montés par `server/sovereignApp.js`).

Variables d’environnement côté hébergeur :

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `PUBLIC_SITE_URL` = `https://egor69.ca` (ou ton domaine)
- `STRIPE_ALLOWED_ORIGINS` = même origine publique
- (optionnel) `STRIPE_ALLOWED_PRICE_IDS`

Frontend :

- `VITE_STRIPE_CHECKOUT_ENDPOINT=/api/stripe/checkout`
