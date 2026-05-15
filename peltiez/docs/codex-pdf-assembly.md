# Assemblage PDF — Codex (Encyclopédie visuelle CirculAI)

**Référence normative :** `peltiez/docs/codex-pdf-blueprint.md` (métadonnées, marges, fond noir, accents or, déploiement).

**Objectif :** donner à Dominic une séquence **actionnable** (ordre des pages, chemins d’actifs, options outils) pour produire `public/encyclopedie.pdf` (remplacer le placeholder généré par le script ci-dessous quand le livrable final est prêt).

---

## 1. Ordre des pages (aligné sur le blueprint)

Reprendre la table « Ordre des pages » du blueprint et la figer dans l’outil d’export (InDesign book, Affinity Publisher, Canva « présentation » + export PDF, etc.).

| # | Bloc éditorial | Notes |
|---|----------------|--------|
| 1 | **Couverture (avant)** | Pleine page ; visuel principal + titre. |
| 2 | **Page de garde** | Texture / titre / sous-titre (fond noir, hiérarchie or). |
| 3 | **Copyright / mentions légales** | Texte court ; renvoi vers `LICENSE` / `NOTICE` du dépôt sans dupliquer le texte juridique sans validation. |
| 4 | **Introduction** | Corps crème/off-white sur noir (voir blueprint §3). |
| 5 | **Table des matières** | Synchroniser avec les titres de chapitres réels. |
| 6+ | **Chapitres (corps)** | Insérer les ouvertures de chapitre puis le texte ; répéter par chapitre. |
| — | **Planches / diagrammes** | Après les chapitres concernés (plan éditorial). |
| — | **Glossaire** | Optionnel v1.0. |
| — | **Annexes** | Optionnel v1.0. |
| — | **Colophon** | Crédits techniques, version PDF (`v1.0`), date. |
| — | **Tranche / spine** | Souvent fichier séparé pour l’imprimeur. |
| — | **Page de clôture** | Optionnel. |
| — | **Quatrième de couverture** | Optionnel. |

---

## 2. Actifs PNG attendus (dépôt `la-finale`)

**Dossier :** `assets/codex-encyclopedie/` (à la racine du workspace, à côté de `peltiez/`).

**Convention :** `codex-encyclopedie-{section}{sous-section}-{rôle-descriptif}.png` — les fichiers listés ci-dessous correspondent aux exports actuels du projet ; ajuster les noms si une passe de renommage uniformise le schéma `codex-encyclopedie-{code}.png` du blueprint §4.

### Section 1 — Couverture et socle (1A–1D)

| Rôle blueprint | Fichiers observés (exemples) |
|----------------|----------------------------|
| 1A couverture | `codex-encyclopedie-1A-couverture.png`, `codex-encyclopedie-couverture-1A.png` |
| 1B cadre | `codex-encyclopedie-1B-cadre-or-grimoire.png`, `codex-encyclopedie-1B-cadre-or.png` |
| 1C mandala / fractal | `codex-encyclopedie-1C-fractal-circulaire.png`, `codex-encyclopedie-1C-motif-fractal-dore.png` |
| 1D texture | `codex-encyclopedie-1D-texture-noir-dorures.png` |

### Section 2 — Page de garde (2A–2C)

| Rôle | Fichiers |
|------|----------|
| 2A titre | `codex-encyclopedie-2A-titre.png` |
| 2B sous-titre / cadre | `codex-encyclopedie-2B-sous-titre.png` |
| 2C ligne éditoriale | `codex-encyclopedie-2C-ligne-editoriale.png` |

### Sections 3–7 — Chapitres et figures (slots A–C)

| Section | Fichiers |
|---------|----------|
| 3 | `codex-encyclopedie-3A-sommaire-ornement.png`, `codex-encyclopedie-3B-index-visuel.png`, `codex-encyclopedie-3C-ornements.png` |
| 4 (chapitre I) | `codex-encyclopedie-4A-chapitre1-opening.png`, `codex-encyclopedie-4B-chapitre1-divider.png`, `codex-encyclopedie-4C-chapitre1-icons.png` |
| 5 (chapitre II) | `codex-encyclopedie-5A-chapitre2-opening.png`, `codex-encyclopedie-5B-chapitre2-divider.png`, `codex-encyclopedie-5C-chapitre2-footer.png` |
| 6 (chapitre III) | `codex-encyclopedie-6A-chapitre3-opening.png`, `codex-encyclopedie-6B-chapitre3-margin.png`, `codex-encyclopedie-6C-chapitre3-corners.png` |
| 7 | `codex-encyclopedie-7A-diagramme-abstract.png` |

Les sections **8–12** du blueprint (chapitres IV–VII, glossaire, annexes, colophon) sont des **emplacements** : ajouter les PNG correspondants quand les planches existent, sans changer le préfixe `codex-encyclopedie-`.

---

## 3. Chaîne recommandée (Dominic)

### Option A — InDesign / Affinity (impression ou PDF haute qualité)

1. Créer un document **A4 ou Lettre** (une norme par édition, blueprint §3).
2. Placer les PNG en **fonds perdu** pour les textures plein écran ; respecter les **marges sûres** pour le texte.
3. Régler les **métadonnées PDF** (titre, auteur, sujet, langue `fr-CA`) selon le tableau du blueprint §2.
4. Export PDF : profil **CMJN** si impression, **sRVB** si diffusion web uniquement.

### Option B — Canva

1. Créer une présentation au format page fixe (A4 / Lettre).
2. Importer les PNG par page dans l’ordre du §1.
3. Exporter en PDF **standard** ou **impression** selon l’usage ; vérifier le poids (compression) pour Vercel.

### Option C — Script Node (recommandé pour `public/encyclopedie.pdf`)

| Script | Rôle | Sortie |
|--------|------|--------|
| **`assemble-codex-encyclopedie-full.mjs`** | Texte Codex Magique + fiches `companion.md` + PNG (ordre blueprint) | `public/encyclopedie.pdf` |
| **`assemble-codex-pdf.mjs`** | PNG seuls, ou PNG + page texte par planche (`--with-text`, `planches-texte.json`) | `docs/encyclopedie/codex-assembled-preview.pdf` ou `--output public/encyclopedie.pdf` |
| **`generate-codex-encyclopedie-placeholder-pdf.mjs`** | Placeholder minimal (1 page) | `public/encyclopedie.pdf` |

**Texte source** : `peltiez/docs/codex-magique-egor69.md` (complet) · injection PDF par planche : `peltiez/docs/encyclopedie/planches-texte.json`.

---

## 4. Commandes utiles

### Encyclopédie complète (texte + images)

```bash
cd peltiez
npm run encyclopedie:assemble-full
```

Équivalent :

```bash
cd peltiez
node ./scripts/assemble-codex-encyclopedie-full.mjs
```

Options :

```bash
# Test rapide (3 planches + pages texte)
node ./scripts/assemble-codex-encyclopedie-full.mjs --limit 3

# Fiches texte seulement (sans pages image plein écran)
node ./scripts/assemble-codex-encyclopedie-full.mjs --skip-images

# Dossier PNG / sortie personnalisés
node ./scripts/assemble-codex-encyclopedie-full.mjs --input "../assets/codex-encyclopedie" --output "./public/encyclopedie.pdf"
```

L’ancien `public/encyclopedie.pdf` est copié vers `encyclopedie.pdf.bak` avant écrasement.

### Aperçu PNG + texte court par planche (`--with-text`)

Métadonnées PDF : *EGOR69 — Codex Magique de l'Oméga Vert* · auteur *Dominic Peltier / Igor 69*. Environ **74 pages** (37 texte + 37 image).

```bash
cd peltiez
node ./scripts/assemble-codex-pdf.mjs --with-text --output ./public/encyclopedie.pdf
```

Régénérer les fiches longues du markdown après édition du JSON :

```bash
node ./scripts/expand-codex-fiches.mjs
```

### Aperçu PNG seul

```bash
cd peltiez
npm run docs:assemble-codex-pdf
```

### Placeholder minimal (URL Vercel)

```bash
cd peltiez
npm run encyclopedie:placeholder-pdf
```

---

## 5. Intégration site (rappel)

- Fichier servi par Vite : `peltiez/public/encyclopedie.pdf` → URL **`/encyclopedie.pdf`**.
- Bouton d’accueil : `peltiez/src/pages/Home.jsx` (libellé français, style codex noir/or).
- **Codex web** : `/docs/investisseur` · `/docs/rituel` (sources `docs/codex-*.md` + miroir `public/docs/`).

Voir aussi `codex-pdf-blueprint.md` §6 pour le schéma d’URL Vercel.

---

## 6. Export PDF — éditions investisseur et rituel (optionnel)

Sources Markdown :

| Édition | Source dépôt | URL statique |
|---------|--------------|--------------|
| Investisseur | `peltiez/docs/codex-investisseur.md` | `/docs/codex-investisseur.md` |
| Rituel | `peltiez/docs/codex-rituel.md` | `/docs/codex-rituel.md` |

**Export rapide (sans bloquer la release)** :

1. **Pandoc** (si installé) — depuis `peltiez/` :
   ```bash
   pandoc docs/codex-investisseur.md -o public/docs/codex-investisseur.pdf --pdf-engine=xelatex -V geometry:margin=2cm
   pandoc docs/codex-rituel.md -o public/docs/codex-rituel.pdf --pdf-engine=xelatex -V geometry:margin=2cm
   ```
2. **Canva / Word / Google Docs** — coller le Markdown ou importer le `.md`, mise en page **fond noir / titres or** pour le rituel, **sobre crème/or** pour l’investisseur (~2 pages).
3. **Impression navigateur** — ouvrir `https://<domaine>/docs/investisseur` ou le fichier `.md` brut, **Imprimer → Enregistrer en PDF**.

Après génération, servir les PDF depuis `public/docs/` si besoin de liens directs (ex. `/docs/codex-investisseur.pdf`). Les routes SPA restent la référence principale.
