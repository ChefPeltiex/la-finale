# CirculAI — Fiche vendeur (one-pager)

_Produits numériques · prix indicatifs CAD · Québec · mai 2026_

## Positionnement

Offres **honnêtes** tirées d’actifs réels du dépôt (PDF, pages Codex, portails). Pas de promesse médicale, pas de métriques ou partenaires fictifs. Paiement Stripe quand configuré ; sinon courriel ou pilote humain.

## Catalogue

| Produit | Prix | Accès |
|---------|------|--------|
| Aperçu encyclopédie (PDF) | Gratuit | `/encyclopedie.pdf` (volume aperçu) |
| Édition complète encyclopédie | 19 $ CA | `/boutique` → Stripe `VITE_STRIPE_PRICE_ENCYCLOPEDIE` |
| Charpente · 8 promesses | Gratuit | `/docs/promesses` |
| Bundle Codex investisseur + preuves | 29 $ CA | `VITE_STRIPE_PRICE_CODEX_BUNDLE` |
| Kit Nature Québec | 24 $ CA | Portail + docs · `VITE_STRIPE_PRICE_NATURE_QC_KIT` |
| Codex magique companion | 12 $ CA | Lecture `/docs/magique` + export selon Stripe |
| Pass explorateur Verse | 44 $ / mois | `/pricing` · `VITE_STRIPE_PRICE_NETHERREALM` |
| Pilote entreprise 90 j | Sur devis | `/pilote` |
| Pack fondateur | 89 $ CA (liste d’attente) | `/contact` |

## Variables Stripe (build)

- `VITE_STRIPE_CHECKOUT_ENDPOINT` — active le checkout hébergé
- `VITE_STRIPE_PRICE_ENCYCLOPEDIE`
- `VITE_STRIPE_PRICE_CODEX_BUNDLE`
- `VITE_STRIPE_PRICE_NATURE_QC_KIT`
- `VITE_STRIPE_PRICE_CODEX_MAGIQUE`
- `VITE_STRIPE_PRICE_NETHERREALM`
- Serveur : `STRIPE_ALLOWED_PRICE_IDS` (allowlist)

## Parcours client

1. **Découverte** — accueil `#accueil-boutique`, encyclopédies, Verse (`/world` bannière).
2. **Aperçu** — PDF gratuit, note « aperçu ≠ édition complète ».
3. **Achat** — `/boutique` filtres (gratuit, encyclopédie, codex, nature, verse, entreprise).
4. **Abonnements** — `/pricing` (passes Netherealm / Etherealm / Outworld).

## Contact

`support@egor69.ca` (ou `VITE_SUPPORT_EMAIL`) — objets produit : `product=<id>` sur leads.
