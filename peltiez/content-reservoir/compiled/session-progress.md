# Journal de session — CirculAI / Egor hub

_Dernière mise à jour : 2026-05-16 · session agent (veille Dominic ~1 h)_

## 16:00 — Audit (Step 0)

### Fait
- Lecture `App.jsx`, `Boutique.jsx`, `Home.jsx`, `digitalProducts.js`, `DigitalProductCard.jsx`, `WorldScene.jsx`.
- Écarts initiaux : liens search/sitemap/nav partiels, boutique sans filtres/hero, pas de produit promesses, note PDF aperçu, manifeste CirculAI.

### En cours → terminé (Steps 1–3)
- Pipeline boutique complété ; build OK ; `reservoir:check` OK.

---

## 16:45 — Livraison (Steps 1–4)

### Fait
- **`/boutique`** : route OK, filtres (chips), hero vedette encyclopédie 19 $, grille avec exclusion du featured en double.
- **`digitalProducts.js`** : catégories filtres, produit gratuit `charpente-promesses` → `/docs/promesses`.
- **Accueil** : `HomeBoutiqueTeaser`, manifeste CirculAI dans `HomeHeroCards`, note « PDF = aperçu » + CTA 19 $ (encyclopédies + hero).
- **Verse** : `WorldHubBoutiqueBanner` ; pluie contemplative déjà dans `WorldScene` (P2-INS-9).
- **Découverte** : `globalSearchIndex` + `/boutique` pilot boost ; `sitemap.xml` ; liens `navPoles`, `Footer`, `Pricing`.
- **Backstage** : `content-reservoir/compiled/products-fr.md` (fiche vendeur).
- **Qualité** : `npm run build` ✓ · `npm run reservoir:check` ✓ · lints fichiers touchés ✓

### En cours
- _(rien — phase humaine : Dominic teste en conditions réelles)_

---

## Table de test manuel

| URL | Quoi voir | Produits / prix |
|-----|-----------|-----------------|
| `/` `#accueil-boutique` | Teaser 4 cartes + lien boutique | Aperçu, complète 19 $, Codex, Nature… |
| `/` `#accueil-encyclopedies` | Aperçu PDF + bouton 19 $ + note aperçu | Gratuit / 19 $ CA |
| `/boutique` | Hero vedette, filtres, grille complète | Voir catalogue ci-dessous |
| `/boutique?filter=gratuit` | Aperçu PDF + promesses | 0 $ |
| `/boutique?filter=codex` | Bundles, magique, promesses | 0–29 $ |
| `/boutique?filter=nature` | Kit Nature QC | 24 $ |
| `/boutique?product=encyclopedie-complete` | Scroll carte encyclopédie | 19 $ CA |
| `/docs/promesses` | Charpente 8 promesses (gratuit) | 0 $ |
| `/pricing` | Lien vers boutique sous l’intro | Passes 44–1444 $ |
| `/world` | Bannière boutique + aperçu PDF dans le HUD | — |

### Catalogue boutique (indicatif)

| ID | Titre | Prix |
|----|-------|------|
| `apercu-encyclopedie` | Aperçu PDF | Gratuit |
| `encyclopedie-complete` | Édition complète | 19 $ CA |
| `charpente-promesses` | 8 promesses | Gratuit |
| `bundle-codex-investisseur-preuves` | Bundle Codex | 29 $ CA |
| `kit-nature-quebec` | Kit Nature QC | 24 $ CA |
| `codex-magique-companion` | Codex magique | 12 $ CA |
| `pass-explorateur-verse` | Pass Verse | 44 $ / mois |
| `pilote-entreprise` | Pilote 90 j | Sur devis |
| `pack-fondateur-codex` | Pack fondateur | 89 $ (liste d’attente) |

### Variables Stripe (build / serveur)

| Variable | Rôle |
|----------|------|
| `VITE_STRIPE_CHECKOUT_ENDPOINT` | Active checkout hébergé |
| `VITE_STRIPE_PRICE_ENCYCLOPEDIE` | Encyclopédie complète |
| `VITE_STRIPE_PRICE_CODEX_BUNDLE` | Bundle investisseur + preuves |
| `VITE_STRIPE_PRICE_NATURE_QC_KIT` | Kit Nature Québec |
| `VITE_STRIPE_PRICE_CODEX_MAGIQUE` | Codex magique |
| `VITE_STRIPE_PRICE_NETHERREALM` | Pass explorateur (abo) |
| `STRIPE_ALLOWED_PRICE_IDS` | Allowlist côté serveur |
| `VITE_SUPPORT_EMAIL` | Mailto fallback (optionnel) |

Sans ces clés : boutons **courriel** ou **pilote** — jamais faux paiement.

### Fichiers modifiés / créés (session)

- `src/data/digitalProducts.js`
- `src/pages/Boutique.jsx`
- `src/components/boutique/DigitalBoutiqueGrid.jsx`
- `src/components/home/HomeHeroCards.jsx`
- `src/components/home/HomeEncyclopediasSection.jsx`
- `src/components/world/WorldHubBoutiqueBanner.jsx` (nouveau)
- `src/pages/WorldHub.jsx`
- `src/pages/Pricing.jsx`
- `public/sitemap.xml`
- `content-reservoir/compiled/session-progress.md`
- `content-reservoir/compiled/products-fr.md`

_Déjà en place avant/après merge parallèle : `App.jsx` route `/boutique`, `HomeBoutiqueTeaser`, `Footer`/`navPoles` liens, `WorldScene` `ContemplationStarShower`, `globalSearchIndex`._

---

**OK — tu peux tester** (parcours boutique, Stripe off, PDF aperçu). Dis « OK pour l’analyse finale » après tes essais réels.
