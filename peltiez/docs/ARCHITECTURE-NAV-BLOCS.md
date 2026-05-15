# Architecture navigation — blocs sujets

**Statut :** modèle produit (mai 2026)  
**Code :** `src/config/navPoles.js` · `src/components/layout/PoleNavigation.jsx`  
**Verse :** voir aussi [VERSE-COSMIC-NAV-DESIGN.md](./VERSE-COSMIC-NAV-DESIGN.md)

---

## Principe

La plateforme conserve **toutes les routes** dans `App.jsx`. La navigation latérale est une **vue** structurée en trois niveaux :

| Niveau | Rôle | Exemple |
|--------|------|---------|
| **Pôle** | Intent utilisateur (5 portes) | Échanger, Explorer, Agir, Jouer, Univers |
| **Bloc sujet** | Regroupement thématique (5–7 en mode pilote) | Marketplace, Atlas, Verse 3D |
| **Route** | Lien React Router existant | `/marketplace`, `/world` |

Le **mode pilote** (activé par défaut) n’affiche que les blocs marqués `pilot: true` ; le reste reste accessible via « Tout voir (avancé) ».

---

## Données (`NAV_POLE_BLOCKS`)

Chaque bloc expose :

- `id`, `label`
- `descriptionSimple` / `descriptionDeep` (selon mode affichage)
- `routes: [{ to, label }]` — `to` = path ou `{ pathname, hash }`
- `pilot` — visible en navigation pilote
- `featured` (optionnel) — mise en avant UI (ex. Verse 3D)

---

## Cartographie Verse (P1)

Dans le Verse 3D (`/world`), les **constellations** (phase P1 de la nav cosmique) correspondent aux **groupes de blocs** par pôle :

```
Pôle Jouer → bloc Verse 3D     → anneaux / realms dans WorldScene
Pôle Explorer → Atlas / Codex  → portails encyclopédie & fiches
…
```

Les `WORLD_REALMS` restent la source des anneaux 3D ; les blocs 2D servent de fil conducteur dans le menu et sur l’accueil (`HomeSubjectBlocks.jsx`).

---

## Fichiers liés

- `src/config/pilotScope.js` — filtrage pilote (aligné sur les blocs)
- `src/lib/globalSearchIndex.js` — boost +35 sur routes pilote
- `src/components/home/HomeSubjectBlocks.jsx` — 5 cartes pôles + CTA Verse

*Document court — à enrichir lors de P1 constellations dans `WorldMinimap`.*
