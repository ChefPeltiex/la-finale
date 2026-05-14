# Unreal Engine ↔ pile web IGOR (Peltiez)

Ce dépôt **n’implémente pas** de plugin Unreal, de fichier `.uproject`, de lecteur Pixel Streaming, ni d’import Datasmith automatisé. La scène 3D navigateur repose sur **Three.js / WebGL** (Verse, Panthéon 3D, etc.). Le texte « Unreal » visible dans l’UI renvoie à une **piste future**, pas à du code présent.

## Ce qui est réellement dans le repo

- **Prototype WebGL** : pages React qui montent des scènes Three.js (`WorldHub`, `Pantheon3D`, autres hubs).
- **API souveraine (client)** : `igorClient` et entités PocketBase pour données métier — tout pont UE passerait par **HTTP/WebSocket** vers ces mêmes principes (pas de SDK UE fourni ici).

## Pistes de pont réalistes (hors bundle actuel)

| Approche | Rôle | Notes |
|----------|------|--------|
| **Export glTF / FBX** | Aller-retour mesh / animations | DCC → fichiers servis en statique ou via CDN ; chargeur côté Three.js déjà écosystème standard. |
| **REST / WebSocket** | État jeu / progression / inventaires | Aligner avec l’API IGOR existante ; auth et schémas à définir côté serveur. |
| **USD / Datasmith** | Pipelines studio | Pertinent pour gros assets et iter IA studio → nécessite tooling Epic et pipeline hors repo. |
| **Pixel Streaming** | Rendu UE dans le navigateur | Flux vidéo + input ; infra dédiée (signalling, GPU), pas de stub dans ce frontend. |

## Pixel Streaming (optionnel)

Si vous adoptez UE pour le rendu : documentez dans **votre** infra (URLs signalling, TURN/STUN, contrôle clavier/souris/touch). Ce repo ne lit aucune variable `VITE_*` Unreal.

## Faux pas à éviter

- Ne pas afficher certifications Epic, labels conformité inventés, ou « intégration UE livrée » sans code/repo correspondant.
- Garder la distinction **vérité navigateur (Three.js)** vs **cible desktop/streamée (UE)** pour éviter les attentes utilisateurs fausses.

## Fichiers utiles côté web

- `src/pages/MyUniverse.jsx` — mention stratégique UE dans l’onglet charte.
- `src/lib/unrealBridge.js` — constantes (chemin doc + copie UI).
- Hubs 3D : `src/pages/WorldHub.jsx`, `src/pages/Pantheon3D.jsx`, données monde `src/world/realms.js`.
- **Hub UEAIOUY** (navigateur) : `src/pages/UeAiouyHub.jsx` — route `/ue-aiouy`, registre glTF/localStorage, prévisualisation, option iframe Pixel Streaming via `VITE_UEAIOUY_PIXEL_STREAM_PLAYER_URL`.
- **Exemple JSON « univers »** (pont futur plugin / outillage UE) : `public/ue-aiouy/universe-config.sample.json` — scènes, POI, bloc `unreal` ; non consommé par le bundle web actuel.

## Programme UEAIOUY

Pont **honnête** Megascans / Unreal Editor → fichiers **glTF/GLB** servis en HTTPS (CORS) → prévisualisation et inventaire dans l’app. Pas de synchro automatique Quixel Bridge ↔ repo ; pas d’Éditeur UE embarqué. Voir aussi `public/ue-aiouy/manifest.sample.json` pour la forme JSON d’export.

---

## Directives — « univers parallèle » avec Unreal Engine (clair et court)

Le **Verse 3D** dans le navigateur reste **Three.js / WebGL**. Un projet **Unreal** est un **parallèle optionnel** (build desktop, ou flux Pixel Streaming). Les étapes type :

1. **Décider du périmètre**  
   - Même univers narratif que le web, ou expérience « premium » séparée ?  
   - Cible : Windows / console / Pixel Streaming ?

2. **Installer l’outil (oui, téléchargement)**  
   - **Epic Games Launcher** + **Unreal Editor** (version LTS ou alignée équipe).  
   - Créer un `.uproject` ; activer le contrôle de version (**Git + Git LFS** ou Perforce pour gros binaires).

3. **Convention de dossiers**  
   - `Content/` : niveaux, Blueprints, matériaux.  
   - `Source/` si C++ ; sinon Blueprint pur pour prototyper.  
   - Garder une **nomenclature** qui mappe vos biomes / royaumes Web (`src/world/realms.js`) pour limiter la dérive créative.

4. **Aller-retour assets avec le web**  
   - Export **glTF / GLB** (ou FBX → glTF) pour réutiliser dans **Three.js** ou le hub **`/ue-aiouy`**.  
   - Ne **versionnez pas** des secrets (clés API, mots de passe) dans le projet UE.

5. **Pont données (HTTP / WebSocket)**  
   - Même principe que l’API IGOR : **HTTPS**, **auth** (tokens courts, refresh côté service), schémas documentés.  
   - Le jeu UE ne doit pas embarquer la **Stripe secret key** ni les secrets serveur du site.

6. **Sécurité irrévocable (priorité)**  
   - Builds signés, chaîne de mise à jour, désactivation du `cheat` en prod.  
   - Pixel Streaming : **TURN/STUN** maîtrisés, pas d’exposition de panels admin sur le flux public.  
   - Journaliser côté serveur les mutations d’état sensibles (hors PII inutile).

7. **Livrable**  
   - Documenter dans **votre** wiki : URL du serveur de jeu, version UE, procédure de build, procédure de rollback.

Pour une entrée **dans le navigateur** sans installer UE : utilisez **`/world`** (Verse WebGL) ; UE reste **hors navigateur** sauf Pixel Streaming.

## Clause Singularité & Outworld (workflow produit)

- Le **navigateur ne lance pas** l’éditeur Unreal : aucun `.uproject` n’est ouvert depuis cette SPA.
- L’activation du **Pass Outworld** dans `Pricing` impose l’acceptation locale de la clause (`SingularityClauseDialog`) + une **Clé de Singularité** (trace stockée dans `localStorage`, sans envoi serveur dans cette version).
- Pour tout **paquet binaire UE** distribué hors navigateur, le pipeline recommandé est : vérifier côté **CI / bundle** que la clé d’accès ou licence métier est présente — ce dépôt ne contient pas de lanceur Epic.

Document imprimable / PDF via navigateur : `public/legal/Legal_Sovereign.html` (Imprimer → Enregistrer au format PDF).

## Protocole assets 3D web (Verse / hub glTF) — charge rapide

Objectif : réduire le temps d’attente avant affichage d’un univers dans le navigateur. Règles **recommandées** pour les créateurs et pipelines internes.

1. **Format unique livré au web : `.glb`**  
   Préférer le conteneur binaire glTF 2.0 (géométrie + matériaux + textures embarquées) plutôt que des chaînes `.obj`/`.fbx` non optimisées pour le streaming web. (FBX reste acceptable en **source** DCC si la sortie publique est `.glb`.)

2. **Compression maillage : extension Draco (`KHR_draco_mesh_compression`)**  
   À l’export (Blender, etc.) ou en post-traitement : activer Draco pour les maillages. C’est une compression **avec quantification** : le gain taille est souvent majeur ; la qualité perçue dépend des réglages. Le hub **`/ue-aiouy`** peut signaler un export « Draco » côté prévisualisation.

3. **Textures : WebP ou KTX2, résolution plafonnée**  
   Éviter PNG/JPEG 4K non compressés pour le web. Cible raisonnable : **max 2048×2048**, textures compressées (WebP ou KTX2 / Basis selon pipeline). Ajuster au cas par cas (props hero vs décors).

**Outil CLI (exemple)** — [`gltf-pipeline`](https://github.com/CesiumGS/gltf-pipeline) (Node.js), avec Draco :

```bash
npx gltf-pipeline -i univers_brut.gltf -o univers_optimise.glb -d
```

L’option `-d` applique la compression Draco au maillage. Vérifier le rendu dans le navigateur après décodage (coût CPU côté client).

**Fichier réseau opérateur (P2P / limites)** : voir `egor-network.json` à la racine du dépôt applicatif et `scripts/egor-network-setup.sh` pour validation et rappels Docker / `ulimit`.
