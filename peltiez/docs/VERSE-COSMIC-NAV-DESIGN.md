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
| P1-INS-6 | **Palier X/9 (arc séquentiel)** | HUD affiche progression par segment (9 groupes de realms ou 9 étapes majeures) — inspiré chapitrage MindfulMed, sans mention Hz ni santé |
| P1-INS-7 | **Focus portail (HUD minimal)** | À &lt; 8 m d’un tore : masquer ou réduire minimap / panneaux secondaires 3–5 s ; `ritualHint` reste visible — équivalent UX « black screen » |
| P1-INS-8 | **Intention de session** | Champ optionnel (localStorage) ou rappel HUD : une ligne honnête avant traversée — inspiré « ask universe » (`OlV26ouCn5w`), **sans** law of attraction ni promesse de manifestation |
| P1-INS-9 | **Sept harmoniques HUD** | Minimap ou bandeau « Harmonie 3/7 » : 7 groupes de realms avec teinte d’accent distincte — inspiré arc 7 chakras (`4mJc9A1yOx0`), **sans** nom chakra, Hz, aura cleansing ni promesse miracle |
| P1-INS-10 | **Cinq couches de session** | HUD « Couche X/5 » sur visites cumulées ou segment d’arc — inspiré stack 5 Hz (`IFH1pi6xIk4`), **sans** fréquences, guérison corps/esprit ni claims santé |
| P1-INS-11 | **Axes corps / esprit** | Deux compteurs discrets (pôles matière vs sens sur `WORLD_REALMS`) — dualité body/spirit (`IFH1pi6xIk4`, `3OvM4ycNVL8`), **sans** vocabulaire chakra ni Hz |
| P1-INS-12 | **Équilibre clair / sombre** | Teinte HUD ou accent minimap bascule doucement (realm visité vs non visité) — inspiré shadow integration / lumière-ombre (`3ciMHwo1ApA`), **sans** trauma healing, horror, ni iconographie hindoue |
| P1-INS-13 | **Seuil Om (respiration)** | À &lt; 6 m d’un tore : rappel `ritualHint` respiration / pause 1–2 s avant `E` — métaphore mantra Om, **sans** audio OM copié ni claim tiers œil |
| P1-INS-14 | **Ancrage au sol** | À &lt; 12 m de l’anneau indigo au sol : HUD une ligne d’ancrage ou `ritualHint` grounding — inspiré résonance Schumann (`r9GYYKrrLAg`), **sans** Hz, pinéale, binaural ni claim santé |
| P1-INS-15 | **Seuil theta (créativité)** | En mode contemplation, à &lt; 8 m d’un tore : une ligne HUD « laissez une intention créative émerger » — inspiré theta / visionnaires (`admhD1UCmI8`), **sans** billionaire, richesse, manifestation, ni Hz theta affichés |
| P1-INS-16 | **Focalisation clarté (horizon)** | À &lt; 8 m d’un tore : HUD « regarder l’horizon » + `ritualHint` variante clarté — inspiré 852 / Ajna (`oHMg7ZeWAxQ`, Inner Lotus), **sans** Hz, pinéale ni promesse d’éveil |
| P1-INS-17 | **Corps entier 7/7 (session)** | Bandeau « Aligné X/7 » : chaque groupe des 7 harmoniques (P1-INS-9) a ≥1 visite en session — inspiré whole body cleansing (`Zocof7wZF4c`), **sans** chakra, 999 Hz, aura healing ni promesse santé |
| P1-INS-18 | **Sept passages (arc narratif)** | HUD « Passage X/7 » sur progression de session ou segment d’arc — inspiré sept niveaux / gardiens (`8kQgu2_1uEk`), **distinct** de P1-INS-9 (harmoniques) ; **sans** gnosticisme, immortalité, Évangile, Vatican ni iconographie religieuse |
| P1-INS-19 | **Rituel seuil 60 s** | À &lt; 5 m d’un tore non visité : option « une minute de présence » (respiration + `ritualHint`) avant `E` ; indicateur discret vers prochain realm si intention en localStorage — inspiré seuil « 1 min » (`deFpiq6EYzE`), **sans** mind control, DMT, pinéale ni promesse de transe forcée |

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
| P2-INS-6 | **Complétion de constellation** | Toast ou badge discret quand tous les realms d’un pôle / galaxie sont visités — arc « parcours complet », sans copy MindfulMed |
| P2-INS-7 | **Dérive passive (session longue)** | Après ~90 s sans input : marche auto lente ou orbite caméra + HUD atténué — mood écoute 6 h (`OlV26ouCn5w`), désactivable ; pas écran noir ni ton 963 Hz |
| P2-INS-8 | **Clarté + halo post-seuil** | Première visite d’un tore / session : brume −10 % density 2 s ; au retour 3D : emissive voyageur +15 % pendant 12 s — mood lumière radiante (`4mJc9A1yOx0`), pas claim purification ni ton 999 Hz |
| P2-INS-9 | **Pluie d’étoiles (contemplation)** | Si mode contemplation actif : particules verticales très légères (`Sparkles` ou équivalent, cap mobile) — inspiration pluie/white noise (`IFH1pi6xIk4`), pas fond tropical |
| P2-INS-10 | **Glow empilé (max 5)** | +1 step emissive `CosmicTraveler` par tore visité en session (plafond 5, reset hors session) — métaphore stack 5 couches, sans audio solfège |
| P2-INS-11 | **Mode nuit cosmique** | Toggle ou créneau soir local : luminosité scène −15 à 20 %, `Stars` factor réduit, vitesse marche défaut −10 % — sommeil profond (`3OvM4ycNVL8`), désactivable ; pas écran noir ni tons 528/432 |
| P2-INS-12 | **Respiration anneau sol** | Pulse emissive ~8 s sur l’anneau au sol si joueur immobile ≥ 5 s à &lt; 12 m — ancrage Schumann (`r9GYYKrrLAg`) ; `prefers-reduced-motion` : intensité fixe ; pas audio binaural |
| P2-INS-13 | **Résonance de seuil (bol original)** | One-shot ambiant très court à l’entrée du tore (timbre bol synthétique, volume bas, toggle) — mood Culture Capital (`3ciMHwo1ApA`), **interdit** extrait Om / piste YouTube |
| P2-INS-14 | **Oscillation brume clair / sombre** | Près d’un portail non visité : `FogExp2` density alterne ±5 % sur 4 s (cycle lent) — équilibre ombre-lumière (`3ciMHwo1ApA`), pas strobe ; `prefers-reduced-motion` désactive |
| P2-INS-15 | **Vague theta (visuelle)** | Si mode contemplation + immobile ≥ 20 s : modulation très lente (`Stars` factor ou particules, période ~4–8 s) — mood theta (`admhD1UCmI8`), désactivable ; **sans** audio theta identifiable ni promesse abondance |
| P2-INS-16 | **Brume qui s’éclaircit (approche)** | Première approche (&lt; 10 m) d’un tore **non visité** en session : `FogExp2` density −8 % pendant 3 s — mood clarté / brouillard mental (`oHMg7ZeWAxQ`), distinct P2-INS-8 (halo **après** visite) et P2-INS-14 (oscillation) |
| P2-INS-17 | **Balayage lumière voyageur** | À 7/7 harmoniques en session (P1-INS-17) : animation emissive bas→haut sur `CosmicTraveler` (2 s, une fois) — whole body cleansing (`Zocof7wZF4c`) ; `prefers-reduced-motion` : halo fixe ; complète P2-INS-8, pas ton 999 Hz |
| P2-INS-18 | **Silence post-traversée** | Au retour 3D après une visite 2D : HUD minimal (minimap + stats masqués) 10–12 s — métaphore « repos du silence » (`8kQgu2_1uEk`), désactivable ; pas promesse d’éveil, transe ni immortalité |
| P2-INS-19 | **Transe cosmique profonde** | Après **60 s** sans input (avant palier 90 s de P2-INS-7) : vignette légère + pulse emissive tore ~0,5 Hz + HUD minimal — mood transe (`deFpiq6EYzE`), désactivable ; pas copy « DMT », pas audio third-eye identifiable |

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

- **Inspiration YouTube (mood univers / anneaux)** : [VERSE-INSPIRATION-YOUTUBE.md](./VERSE-INSPIRATION-YOUTUBE.md) — synthèse en tête de fichier ; `pSXgXAqomMY`, `NxXzQLl2H5Y`, `OlV26ouCn5w`, `4mJc9A1yOx0`, `IFH1pi6xIk4`, `3OvM4ycNVL8`, `oHMg7ZeWAxQ` (852 Hz, clarté), `r9GYYKrrLAg` (Schumann, ancrage sol), `3ciMHwo1ApA` (Om, ombre-lumière), `deFpiq6EYzE` (rituel 60 s, transe profonde — **audio-first**, pas vol spatial ni anneaux gameplay), `Zocof7wZF4c` (999 Hz + 7 chakras corps entier ~2 h 21 — **renforce** P1-INS-9 / P2-INS-8 ; stock footage décoratif, pas flight rings), `8kQgu2_1uEk` (documentaire FR Évangile Marie — 7 passages narratifs, **pas** solfège ni vol cosmique)
- Manuel utilisateur : `src/content/manuel-utilisation-igor.md` (section Verse)
- QA : `docs/MANUAL-QA-PROTOCOL.md` (explorateur cosmique)
- Glossaire : entrée « Verse 3D » dans `src/data/glossaryCentral.js`

*Document maintenu avec le dépôt CirculAI / peltiez — mai 2026.*
