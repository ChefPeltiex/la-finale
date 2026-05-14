# Performance — garde-fous (IGOR / Peltiez)

Cible de mise en ligne : **21 mai 2026** — avant déploiement, exécuter `npm run verify` + `npm run analyze` et contrôler `dist/bundle-report.json` (généré par `scripts/bundle-report.mjs`).

## Analyse bundle (front)

- Commande : `npm run analyze`
- Résultat : `dist/stats.html`

**À interpréter :**
- Chercher les gros modules (Three/R3F, Leaflet, Stripe) et vérifier qu’ils sont chargés **uniquement** sur les routes qui en ont besoin (lazy routes).
- Réduire les imports “barrel” et préférer des imports ciblés si un module gonfle le bundle.

## Règles simples (sans promesse)

- Priorité : First Load JS raisonnable + navigation fluide.
- Sur mobile : limiter animations non essentielles, éviter boucles de rendu 3D en arrière-plan.
- Activer compression Brotli/Gzip au niveau hébergeur/CDN.

