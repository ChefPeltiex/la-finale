# Verse 3D — Navigation cosmique (Anneaux Gemini)

**Statut :** spécification produit + MVP technique (P0)  
**Route :** `/world` · code : `src/world/WorldScene.jsx`, `src/pages/WorldHub.jsx`  
**Drapeau :** `COSMIC_NAV_V2` (`src/config/cosmicNav.js`) — désactiver avec `VITE_COSMIC_NAV_V2=false`

---

## Vision utilisateur (capturée)

Remplacer l’exploration « pawn vert sur terrain » par un **voyage immersif dans l’univers** :

| Élément | Intention |
|---------|-----------|
| **Contrôles** | Flèche **haut** / **W** = avancer vers l’horizon (pas reculer vers la caméra) ; souris = regard (pointer lock après clic canvas) |
| **Progression narrative** | Constellations → galaxies (matières / chapitres) → étoiles (maîtrise des « 3 mondes unis ») → météorites (énigmes mentales) → comètes (indices) |
| **Anneaux** | Chaque portail du Verse = anneau vers une section réelle du site (déjà modélisé dans `src/world/realms.js`) |
| **Ambiance** | Vol cosmique, ciel étoilé dense, voyageur lumineux (noyau + anneau) au lieu du capsule vert |

**Hors scope MVP :** jeu galaxy complet, puzzles météorites, IA décorateur branchée en live.

---

## Phases de livraison

### P0 — Contrôles & hooks (livré en MVP)

- Correction du vecteur **forward** aligné caméra third-person (`movementVectorsFromYaw` dans `CosmicNavControls.jsx`).
- **Pointer lock** + sensibilité souris centralisées (`usePointerLockLook`).
- Clavier : WASD + flèches ; `preventDefault` sur flèches / espace pour éviter le scroll parasite.
- Avatar **CosmicTraveler** (icosaèdre + tore doré) si `COSMIC_NAV_V2`.
- Densité visuelle légèrement augmentée (étoiles, brume, anneau au sol indigo).

### P1 — Carte constellations

- Minimap / radar : couches « constellation » (regroupement des `WORLD_REALMS` par pôle).
- Fil conducteur HUD : objectif courant (prochain portail non visité).
- Données : étendre `worldPersistence` (constellations débloquées).
- **Alignement 2D :** les blocs sujets de `NAV_POLE_BLOCKS` (`docs/ARCHITECTURE-NAV-BLOCS.md`) préfigurent ces groupes — un bloc = future constellation dans le HUD.

**P1 — inspiration mood « univers / anneaux »** ([VERSE-INSPIRATION-YOUTUBE.md](./VERSE-INSPIRATION-YOUTUBE.md)) :

| ID | Tâche | Critère d’acceptation |
|----|--------|------------------------|
| P1-INS-1 | **Mode contemplation** (toggle ou défaut doux) | Vitesse marche −10 à 15 %, sprint optionnel ; caméra smoothing inchangé ou +5 % quand actif |
| P1-INS-2 | **Bannière « Prochain anneau »** | HUD affiche label + `ritualHint` du realm non visité le plus proche (géométrie 3D) |
| P1-INS-3 | **Palette cœur / cosmos** | Accents HUD indigo + rose doux sur proximité portail ; pas de copie visuelle YouTube |
| P1-INS-4 | **Constellations par pôle** | Minimap regroupe mythologies / bien-être / divinatoire / cœur (~24 m) en arcs nommés |
| P1-INS-5 | **Accessibilité mouvement** | `prefers-reduced-motion` : pas de pulsation agressive sur les tores ; étoiles déjà réduites |

### P2 — Galaxies & chapitres

- Une **galaxie** = sujet (ex. mythologies, bien-être, divinatoire) avec **chapitres** = sous-ensembles de realms.
- UI grimoire (`VerseGrimoire.jsx`) : onglets par galaxie, pas seulement par portail.
- Liaison vers pages 2D existantes (déjà les `path` des realms).

**P2 — vol symbolique & échelle (sans gameplay copié)** :

| ID | Tâche | Critère d’acceptation |
|----|--------|------------------------|
| P2-INS-1 | **Traversée de tore** | À `E` / Entrée : 0,8 s scale/emissive pulse sur le portail puis navigation 2D |
| P2-INS-2 | **Fil d’anneaux** | Trace discrète (arc ou particules) vers les 3 prochains realms sur la minimap |
| P2-INS-3 | **Densité étoiles ∝ progression** | `Stars.count` ou `factor` augmente par paliers de visites (cap performance mobile) |
| P2-INS-4 | **Ambiance audio originale** | Boucle ambiante libre de droits — **interdit** : piste Inner Lotus / solfège de la référence |
| P2-INS-5 | **Anneaux décoratifs** | Tores secondaires non cliquables entre constellations (pure profondeur, pas de collision gameplay) |

### P3 — Météorites, comètes, énigmes

- **Météorites** : interactifs 3D déclenchant énigmes (state local, pas API externe obligatoire).
- **Comètes** : traînées lumineuses + toast « indice » vers lore / fiche Codex.
- Progression sauvegardée : localStorage + option API souveraine plus tard.

### P4 — Habitants & faune

- PNJ décoratifs (instanced meshes), bestiaire symbolique lié à l’Atlas.
- Synchronisation avec `universePreferences` (univers personnel nommé).

---

## Stack technique

| Couche | Choix actuel |
|--------|----------------|
| Rendu | **Three.js** via **React Three Fiber** + **drei** (`Stars`, `Sky`, `Sparkles`, `Environment`) |
| Scène Verse | `WorldScene.jsx` (terrain procédural `terrain.js`, portails tore dans `realms.js`) |
| Hub UI | `WorldHub.jsx` (HUD, aide, Codex, minimap) |
| Panthéon séparé | `Pantheon3D.jsx` (anneaux narratifs entités — autre route `/pantheon-3d`) |

Pas de moteur Unreal embarqué dans le bundle ; parallèle UE documenté dans `docs/unreal-bridge.md` et `IntegrationsOutilsHub.jsx`.

---

## Fichiers clés

```
src/config/cosmicNav.js              # COSMIC_NAV_V2, vitesses
src/components/world/CosmicNavControls.jsx  # clavier, pointer lock, avatar, vecteurs
src/world/WorldScene.jsx             # Canvas R3F, portails, contrôleur
src/pages/WorldHub.jsx               # route /world
src/world/realms.js                  # anneaux / salles / positions
src/components/world/VerseGrimoire.jsx
src/components/world/WorldMinimap.jsx
docs/alliance-ia-egor69.md           # orchestration agents (voir ci-dessous)
```

---

## Alliance IA — rôle « Décorateur » (futur)

**Pas de faux pont API Claude/Gemini** dans le Verse : aucune promesse de modèle branché en direct sur la scène 3D.

Rôle cible dans l’**Alliance IA EGOR69** ([alliance-ia-egor69.md](./alliance-ia-egor69.md)) :

| Rôle proposé | Mandat | Limite |
|--------------|--------|--------|
| **Décorateur** (extension) | Palettes, densité particules, copy HUD, suggestions de placement portails | Sorties **proposées** ; humain valide ; pas de `git push` auto sur `WorldScene` |

Rapprochement des agents existants : **Cartographe** (liens, parcours), **Alchimiste** (assets), filtre **Φ** avant tout texte utilisateur visible.

Référence croisée à ajouter dans `alliance-ia-egor69.md` (section agents) lors d’une PR dédiée alliance — ce document en est la source produit.

---

## Tests manuels (P0)

1. Ouvrir `/world`, cliquer le canvas (pointer lock).
2. **W** et **↑** : le voyageur s’éloigne de la caméra (avance vers l’horizon).
3. **S** et **↓** : recul.
4. Souris : yaw / pitch fluides ; Échap libère le curseur (comportement navigateur).
5. Vérifier absence du **capsule vert** si `COSMIC_NAV_V2` actif.
6. `npm run build` sans erreur.

---

## Références

- **Inspiration YouTube (mood univers / anneaux)** : [VERSE-INSPIRATION-YOUTUBE.md](./VERSE-INSPIRATION-YOUTUBE.md) — `pSXgXAqomMY` (méditation cosmique, pas gameplay anneaux)
- Manuel utilisateur : `src/content/manuel-utilisation-igor.md` (section Verse)
- QA : `docs/MANUAL-QA-PROTOCOL.md` (explorateur cosmique)
- Glossaire : entrée « Verse 3D » dans `src/data/glossaryCentral.js`

*Document maintenu avec le dépôt CirculAI / peltiez — mai 2026.*
