# Arborescence fonctionnelle — Routes SPA ↔ API IGOR

Vue **réaliste** (simplifiée) : le front **React** consomme surtout **base44** (client) pour les données métier ; le serveur **Express** (`server/sovereignApp.js`) expose des routes **REST** pour Stripe, CRM, Atlas et santé.

## Schéma global

```mermaid
flowchart TB
  subgraph Client["Navigateur — Vite + React"]
    UI[Pages & composants]
    RQ[React Query]
    B44[Client base44 — entités / fonctions]
    STRIPE_JS["@stripe/stripe-js — Payment Element"]
  end

  subgraph API["Node Express :8787 — createSovereignApp"]
    H["GET /api/health"]
    M["GET /api/platform/metrics-live"]
    A1["GET /api/atlas/fiches-vivantes-count"]
    A2["GET /api/atlas/fiches-vivantes-preview"]
    A3["GET /api/atlas/fiche-vivante/:scanId"]
    A4["POST /api/atlas/convert-scans-to-live-sheets"]
    C["POST /api/stripe/checkout"]
    PI["POST /api/stripe/payment-intent"]
    WH["POST /api/stripe/webhook"]
    CRM["POST /api/crm/lead"]
  end

  UI --> RQ
  RQ --> B44
  UI --> STRIPE_JS
  UI -->|"fetch JSON (origine autorisée)"| H
  UI --> M
  UI --> A1
  UI --> A2
  UI --> A3
  UI -->|"batch protégé"| A4
  UI --> C
  UI --> PI
  STRIPE_JS -->|"Stripe.js"| StripeCloud[(Stripe)]
  WH --> StripeCloud
  C --> StripeCloud
  PI --> StripeCloud
  CRM --> FileStore[(Fichiers locaux / NDJSON)]
  A4 --> AtlasRepo[(Données Atlas vivant)]
  A1 --> AtlasRepo
  A2 --> AtlasRepo
  A3 --> AtlasRepo
```

## Routes SPA (échantillon — voir `src/App.jsx`)

| Chemin | Rôle |
|--------|------|
| `/` | Accueil |
| `/marketplace` | Annonces |
| `/legal`, `/charte` | Cadre légal / charte |
| `/carte-site` | Cartographie & glossaire |
| `/pricing`, `/abonnement` | Offres / checkout côté UI |
| `/api/*` | **Pas** servi par Vite en prod : appels vers **origine** du site ou `VITE_*` proxy selon config déploiement |

> En développement local, le front (`5173`) et l’API (`8787`) sont **des origines différentes** : CORS et variables `STRIPE_ALLOWED_ORIGINS` / `PUBLIC_SITE_URL` doivent être alignés.

## Mise à jour du schéma

1. Ajouter une route dans `sovereignApp.js` → documenter ici.  
2. Ajouter une page dans `App.jsx` → référencer dans `docs/MANUAL-QA-PROTOCOL.md` pour les tests manuels.
