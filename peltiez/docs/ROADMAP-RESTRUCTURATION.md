# Roadmap — restructuration (vitrine, réservoir, données)

Document de travail pour aligner navigation, données et automatisation sans déplacements massifs non validés. **Aucune suppression de fichiers n’est prévue ici « en urgence »** : les doublons signalés demandent une décision consciente (source de vérité, build, déploiement).

---

## Principe directeur

| Couche | Rôle | Emplacement typique |
|--------|------|----------------------|
| **Vitrine (app)** | Pages React, routes, SEO, expérience utilisateur | `peltiez/src/pages/`, `peltiez/src/components/`, routage dans `peltiez/src/App.jsx` |
| **Contenu servi au navigateur** | Fichiers statiques chargés par l’app (ex. `fetch('/docs/…')`) | `peltiez/public/docs/*.md` |
| **Réservoir (backstage)** | Brouillons, collages, schémas **hors bundle Vite** | `peltiez/content-reservoir/` (`inbox/`, `drafts/`, `schemas/`) |
| **Données prod (bundle / import)** | Modules consommés par le code compilé — source de vérité runtime | `peltiez/src/data/*.js`, imports `?raw` depuis `docs/` quand prévu |

Règle d’usage : tout ce qui doit être **importé ou typé comme donnée métier stable** finit dans `src/data/` (ou module dédié) après passage par le réservoir ; le markdown sous `public/docs/` reste **fichiers publics** ; `peltiez/docs/` reste principalement **documentation interne**, sauf lorsqu’un composant importe explicitement un `.md` en `?raw`.

---

## État actuel (inventaire ciblé)

### Routes Nature Québec (CirculAI / portail fiction)

Chemins réels dans `peltiez/src/App.jsx` :

| URL | Page | Fichier |
|-----|------|---------|
| `/portail/nature-quebec` | Hub portail | `peltiez/src/pages/NatureQuebecHub.jsx` |
| `/nature-quebec` | Redirection permanente vers `/portail/nature-quebec` | `Navigate` dans `App.jsx` |
| `/docs/nature-quebec-portail` | Vue Codex markdown (table 12 portails) | `peltiez/src/pages/CodexNatureQuebec.jsx` → `CodexMarkdownView` avec `slug="nature-quebec"`, `docFile="grand-portail-nature-quebec.md"` |
| `/docs/nature-quebec-kit` | Kit activation (markdown importé en bundle) | `peltiez/src/pages/NatureQuebecKitDoc.jsx` importe `peltiez/docs/nature-quebec-activation-kit.md?raw` |

Données structurées du hub : `peltiez/src/data/natureQuebecPortail.js` (champ `canonicalPath: "/portail/nature-quebec"`).

`CodexMarkdownView` charge le contenu via **`fetch('/docs/' + fichier)`** — donc le fichier servi en prod pour le portail table est **`peltiez/public/docs/grand-portail-nature-quebec.md`**.

### Verse (monde 3D / navigation cosmique)

| Élément | Chemin ou fichier |
|---------|-------------------|
| Route hub 3D | `/world` → `peltiez/src/pages/WorldHub.jsx` |
| Référence design / Gemini (doc) | `peltiez/docs/VERSE-COSMIC-NAV-DESIGN.md` |
| Données royaumes / portails narration | `peltiez/src/world/realms.js` (et dossier `peltiez/src/world/`) |
| Composants liés | ex. `peltiez/src/components/world/VerseGrimoire.jsx`, `VerseMaitre.jsx`; HUD `peltiez/src/lib/verseHud.js` |

### Promesses (charpente / docs)

- Route : `/docs/promesses` → `peltiez/src/pages/PromessesCharpente.jsx`.

### Pilote 90 jours

- Route : `/pilote` → `peltiez/src/pages/Pilot90.jsx`, panneau `peltiez/src/components/pilot/Pilot90Panel.jsx`.

### « Hooks » Gemini (pont symbolique — pas l’API Google)

Il n’y a pas, dans ce dépôt, d’appel runtime documenté au SDK/API Gemini pour la scène 3D. Le **pont métaphorique et calendaire pilote** est centralisé dans :

- `peltiez/src/lib/geminiBridge.js`

Consommateurs repérés (scan) : `HomeGeminiBridgeStrip.jsx`, `Pilot90Panel.jsx`, `GuideAgent.jsx`, `VerseMaitre.jsx`, `realmFrequency.js`, `OnboardingFlow.jsx`. Référence textuelle UI ailleurs (ex. `ZeldaTower.jsx`). La doc explicitant l’absence de faux pont API est dans `peltiez/docs/VERSE-COSMIC-NAV-DESIGN.md`.

### Recherche globale et navigation

Index des entrées « extra » pilote / docs : `peltiez/src/lib/globalSearchIndex.js` (y compris Nature Québec, Verse `/world`, promesses).

---

## Doublons et frictions détectées

_Ne pas supprimer ce soir sans validation : décider demain la **source unique** puis synchroniser ou retirer l’autre copie._

1. **`grand-portail-nature-quebec.md` en double**  
   - `peltiez/docs/grand-portail-nature-quebec.md`  
   - `peltiez/public/docs/grand-portail-nature-quebec.md`  
   L’UI Codex lit **`public/docs`** ; la copie sous `docs/` peut servir de brouillon ou rester désynchronisée — à trancher.

2. **Même schéma « docs internes » vs « public docs »** pour plusieurs codex connexes (titres peuvent diverger au fil du temps) :  
   `codex-investisseur.md`, `codex-rituel.md`, `codex-magique.md`, `alliance-ia-egor69.md`, `preuves-en-2-minutes.md`, `modeles-operationnels.md` présents à la fois sous `peltiez/docs/` et `peltiez/public/docs/` (liste issue du dépôt).

3. **Deux pipelines markdown pour Nature Québec** :  
   - Table portail : `fetch` depuis `public/docs` (`CodexMarkdownView`).  
   - Kit activation : **import bundle** depuis `peltiez/docs/nature-quebec-activation-kit.md?raw` (`NatureQuebecKitDoc`).  
   Comportement voulu possible, mais il faut le **garder à l’esprit** lors des mises à jour (deux chemins distincts).

4. **Documentation du workflow réservoir vs emplacement CI**  
   Le `README` du réservoir mentionne `.github/workflows/reservoir-check.yml` ; le fichier effectif observé dans ce workspace est à la racine du dépôt : **`.github/workflows/reservoir-check.yml`** (pas sous `peltiez/`). Script local : `npm run reservoir:check` → `peltiez/scripts/reservoir-check.mjs`.

---

## Plan en trois phases

### Phase 1 — Consolidation navigation et libellés (faible risque)

- Harmoniser les intitulés menu / recherche / SEO pour Nature Québec, Verse et docs pilote (`globalSearchIndex.js`, `navPoles` / `layoutNavItems` si besoin).
- Documenter dans un encart court (ou commentaire de module) le **double chemin** kit (`?raw`) vs codex (`public/docs`).
- Vérifier que la redirection `/nature-quebec` → `/portail/nature-quebec` reste la seule entrée « courte » souhaitée.

### Phase 2 — Données (promotion réservoir → `src/data`)

- Faire transiter les contenus validés depuis `content-reservoir/drafts/` vers `peltiez/src/data/` (ou modules world/codex dédiés), avec schéma `content-reservoir/schemas/` quand applicable.
- Pour les gros tableaux markdown : soit générer du JSON/JS depuis le réservoir, soit **une** source markdown + script de copie vers `public/docs` (éviter l’édition manuelle en double).
- Garder `public/docs` pour ce qui doit rester **téléchargeable ou fetchable** tel quel ; mutualiser avec `docs/` seulement via processus clair.

### Phase 3 — Automatisation et CI (validation stricte)

- Durcir `reservoir:check` (codes de sortie non nuls sur erreur bloquante) et/ou étendre le workflow racine **`reservoir-check`** pour inclure vérifs de présence des `.md` référencés par `CodexMarkdownView` et pages associées.
- Ajouter une étape optionnelle : comparaison ou checksum entre paires `docs/` vs `public/docs/` **sur les fichiers couplés**, pour alerter avant déploiement.
- Intégrer ces garde-fous dans la chaîne `verify` / CI existante (`peltiez/package.json` — `verify`, workflows sous `peltiez/.github/workflows/` et racine).

---

## Checklist demain matin (actionnable)

1. Ouvrir ce fichier et valider la **source de vérité** pour `grand-portail-nature-quebec.md` (garder `public/docs` + archiver ou synchroniser `docs/`).
2. Parcourir les paires `peltiez/docs/*.md` ↔ `peltiez/public/docs/*.md` listées plus haut : noter lesquels **doivent** rester dupliqués (build vs doc interne) et lesquels peuvent fusionner.
3. Tester en local les trois URLs Nature Québec : `/portail/nature-quebec`, `/docs/nature-quebec-portail`, `/docs/nature-quebec-kit`.
4. Relire `peltiez/src/lib/globalSearchIndex.js` et un échantillon du menu : les titres correspondent-ils au vocabulaire souhaité pour le pilote ?
5. Lancer `npm run reservoir:check` depuis `peltiez/` et noter les avertissements ; décider quand les transformer en **échec CI**.
6. Si une promotion de contenu est prévue : partir d’une entrée `content-reservoir/inbox/` ou `drafts/` plutôt que d’éditer directement `src/data/` sans trace.
7. Pour le Verse : confirmer que la doc `VERSE-COSMIC-NAV-DESIGN.md` reflète toujours le comportement actuel de `/world` et des composants sous `src/components/world/`.
8. **Feu vert explicite** avant toute suppression massive, renommage de dossiers racine ou déplacement d’assets partagés.

---

*Dernière mise à jour : rédaction nocturne sans commit automatisé — fichier ajouté pour planification sûre.*
