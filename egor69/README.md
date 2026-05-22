# EGOR69 — Le Bréviaire Universel

> *638 cristaux de savoir contemplatif. Un outil pour penser, pas pour croire.*

## Vision

Un sanctuaire numérique où chaque écran devient une page de manuscrit vivant :
équations flottantes sur fond cosmique, portraits de maîtres gravés comme des saints laïcs,
constantes mystiques pulsant comme des mantras.

## Cristaux

| Corpus | Entrées | Contenu |
|--------|---------|---------|
| Équations | 110 | Formules Wikipedia avec LaTeX, toutes disciplines |
| Disciplines | 150 | Sciences, arts, humanités |
| Arts & Culture | ~220 | Loisirs, culture générale |
| Musique | 130 | Théorie, instruments, genres, compositeurs |
| **Total** | **638** | |

## Navigation

- **Crawl d'intro** — Star Wars scroll (skippable, mémorisé via localStorage)
- **Hub 6 portes** — Équations · Disciplines · Arts & Culture · Musique · Tout · Aléatoire
- **Navigation** — Par discipline, par corpus, recherche plein texte, aléatoire
- **Cristal** — Titre + formule KaTeX (si applicable) + définition + lien Wikipedia
- **Clavier** — ← → pour naviguer, Echap pour retour

## Stack

- React 19 + TypeScript + Vite 8
- Three.js (fond étoilé)
- Framer Motion (animations)
- KaTeX (rendu LaTeX)
- Cormorant Garamond (Google Fonts)

## Dev

```bash
cd egor69
node scripts/build-corpus.mjs   # régénère public/crystals.json depuis les corpus
npm run dev                      # développement
npm run build                    # production (dist/)
```

## Palette

| Rôle | Hex |
|------|-----|
| Fond cosmique | `#050a1a` |
| Bleu nuit | `#0a1628` |
| Or vieilli | `#d4a843` |
| Texte | `#f0f0f0` |
| Gris lunaire | `#8892a4` |

---

*Dominic · 2026 · "Mathematics = ?" — La question qui contient toutes les réponses.*
