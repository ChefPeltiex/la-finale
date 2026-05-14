# IGOR — plateforme souveraine & prototype CirculAI φ

## 1. Contexte : nombre d’or (extrait)

Le **nombre d’or** (section dorée, proportion dorée, *divine proportion*) est une proportion définie en géométrie comme l’**unique rapport** `a / b` entre deux longueurs `a` et `b` telles que le rapport de la somme `a + b` sur la plus grande (`a`) soit égal à celui de la plus grande (`a`) sur la plus petite (`b`) :

**(a + b) / a = a / b = φ**

La **spirale dorée** utilisée dans le prototype visuel est un **cas particulier de spirale logarithmique** (croissance exponentielle du rayon avec l’angle, pas lié à φ).

Texte de référence étendu (spirale, valeur de φ, usage dans le dépôt) : **`docs/Nombre d'or.txt`**.

---

## 2. À propos (IGOR)

IGOR est une base applicative **entièrement souveraine** (sans dépendance à un builder ou runtime externe pour exécuter le cœur du produit). Ce dépôt contient tout le nécessaire pour lancer l’application en local.

Le **prototype CirculAI φ** (landing, tokens CSS, A/B, optimisation 1D) vit sous `public/circulai-phi/` et dans la doc `docs/PHI-DESIGN-SYSTEM-AND-ROADMAP.md` (dont la section **Documentation technique concise**).

---

## 3. Prérequis

1. Cloner le dépôt (URL Git du projet).
2. Ouvrir le répertoire **`peltiez/`**.
3. Installer les dépendances : `npm install`.
4. Optionnel : copier `.env.example` → `.env` (Vite) et `.env.server.example` → `.env.server` (API locale) — voir `server/README.md`.

---

## 4. Lancer en local

- **Frontend seul** (sans appels `/api`) : `npm run dev` → [http://localhost:5173](http://localhost:5173).
- **Frontend + API** (recommandé) : `npm run dev:stack` — Vite + Express sur le port **8787** avec proxy ; ou deux terminaux : `npm run dev:api` (ou `npm run server`) et `npm run dev`.
- **SEO** : `public/sitemap.xml` et `public/robots.txt` utilisent **`https://egor69.ca`** ; titres et descriptions par route sont mis à jour côté client via `SEOMeta`.

---

## 5. Déploiement

Déploiement type **Vercel** (SPA) en important le dépôt : sortie de build dans **`dist/`**.

---

## 6. Prototype CirculAI (φ), design system et optimisation

| Élément | Emplacement / URL dev |
|--------|------------------------|
| **Bundle** | `public/circulai-phi/` — `index.html`, `design-tokens.css`, `golden_search.py`, `ab_experiment.js`, `deploy-checklist.md`, `README.md` |
| **Page** | `/circulai-phi/index.html` |
| **Alias landing** | `/prototype-phi-landing.html` |
| **Tokens (racine)** | `/design-tokens.css` (réimporte `circulai-phi/design-tokens.css`) |
| **Python** | `scripts/golden_search.py` (compat : `scripts/golden_section_search.py`) |
| **JavaScript** | `src/lib/goldenRatio.js` (`PHI`, `goldenSectionSearch`, spirale SVG) |
| **A/B** | `public/circulai-phi/ab_experiment.js` — `window.__circulai_phi`, `window.circulaiAB`, `data-experiment-phi`, classes `phi-variant` / `control-variant`, `dataLayer` (`experiment_assign`, `circulai_ab`, `experiment_conversion`) |
| **Doc produit** | `docs/PHI-DESIGN-SYSTEM-AND-ROADMAP.md` (roadmap, KPI, checklist, §8–9) |

Le **`README.md`** sous `public/circulai-phi/` est le **README autonome** du prototype (installation, tokens, A/B) ; la suite (design system détaillé, roadmap, §4–9) est dans **`docs/PHI-DESIGN-SYSTEM-AND-ROADMAP.md`**.

**Staging** : servir le répertoire `public/` ; définir les métriques A/B avant toute montée en charge (canary).

---

## 7. Autres documentations

- `docs/unreal-bridge.md` — pont Unreal / web  
- `docs/INTEGRATIONS-SECURITE-ENTREPRISE.md` — cadre entreprise / IA / sécurité  
- `server/README.md` — API locale  

---

## 8. Philosophie d’usage de φ dans le code

Les variables `--phi`, la spirale et la **recherche par section dorée** sont des **outils** (proportion, hiérarchie visuelle, optimisation 1D sans dérivée). Elles complètent le design system et les scripts d’expérimentation ; elles ne remplacent pas mesure utilisateur, accessibilité ni analyse statistique des A/B.
