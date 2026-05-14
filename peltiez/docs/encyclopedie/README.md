# Assemblage PDF — Encyclopédie visuelle CirculAI (Codex)

Ce guide opérationnalise le gabarit unique de vérité : [`../codex-pdf-blueprint.md`](../codex-pdf-blueprint.md). Toute dérogation doit être documentée (édition, impression, diffusion web).

## Emplacement des images

- **Dépôt (recommandé quand la taille le permet)** : `assets/codex-encyclopedie/` à la racine du monorepo (`la finale/`), fichiers `codex-encyclopedie-*.png`.
- **Alternative** : dossier local ou release / LFS — indiquer le chemin exact dans la fiche de livraison de l’édition.

## Liste de pages (ordre éditorial de référence)

Aligné sur la section 5 du blueprint. Les planches PNG suivent la grille de nommage (sections 1–12, codes A–C) ; l’ordre logique du document reste :

| Ordre | Contenu |
|------|---------|
| 1 | Couverture (avant) |
| 2 | Page de garde |
| 3 | Copyright / mentions légales |
| 4 | Introduction |
| 5 | Table des matières |
| 6+ | Chapitres (corps) |
| — | Planches diagrammes (selon plan éditorial) |
| — | Glossaire |
| — | Annexes |
| — | Colophon |
| — | Tranche / spine (optionnel, souvent export séparé) |
| — | Page de clôture |
| — | Quatrième de couverture (optionnel) |

**Correspondance visuels / slots** : voir les tableaux des sections 1–2 et 3–12 du blueprint (`codex-encyclopedie-{code}.png`, ex. `1A`, `10B`).

## Checklist métadonnées (export PDF)

À cocher dans l’outil d’export (InDesign, Affinity, Canva Pro PDF, script, etc.) :

- [ ] **Titre** : Encyclopédie visuelle CirculAI  
- [ ] **Sous-titre** : Codex — édition CirculAI (ajuster selon l’édition)  
- [ ] **Auteur** : Dominic Peltier  
- [ ] **Créateur / organisation** : CirculAI  
- [ ] **Sujet** : Encyclopédie visuelle et cadre éditorial CirculAI (Codex)  
- [ ] **Mots-clés** : CirculAI, Codex, encyclopédie, économie circulaire, visualisation  
- [ ] **Langue** : `fr-CA`  
- [ ] **Licence / avis** : renvoi vers `LICENSE` / `NOTICE` à la racine du dépôt (pas de texte légal dupliqué sans validation juridique)

## DPI, marges et export (rappel)

| Sujet | Recommandation |
|--------|----------------|
| **Format** | A4 **ou** Lettre US — une norme par édition, figée pour toute la chaîne |
| **Fond** | Noir (#000000 ou équivalent CMJN selon profil) |
| **DPI impression** | Raster **≥ 300** à la taille finale |
| **DPI web / léger** | **150–200** acceptable ; vectoriel + compression adaptée si possible |
| **Marges sûres** | Intérieur **≥ 12 mm** ; extérieur / haut / bas **≥ 10 mm** pour le texte critique ; textures en **fonds perdus** (~3 mm) si impression commerciale |
| **Profil** | Impression : CMJN + profil imprimeur ; écran : sRVB — documenter dans la fiche de livraison |

## Déploiement (rappel)

- Fichier servi par le site : `peltiez/public/encyclopedie.pdf`  
- URL type : `https://circulai-copy.vercel.app/encyclopedie.pdf` (vérifier le domaine Vercel réel)

---

## Parcours outils (pas à pas)

### Canva (export PDF)

1. Créer un document aux dimensions **A4** ou **Lettre** (cohérent avec le blueprint).  
2. Importer les PNG depuis `assets/codex-encyclopedie/` (ou dossier livré).  
3. Respecter l’ordre des pages ci-dessus ; pages texte : respecter les **marges sûres**.  
4. Fond noir global ou par page selon les maquettes.  
5. **Télécharger** → **PDF standard** ou **PDF pour l’impression** selon l’usage ; renseigner titre / auteur si l’UI le permet.  
6. Contrôle visuel (contraste, compression, pagination), puis copie vers `peltiez/public/encyclopedie.pdf` quand validé (voir note SCALE en bas).

### Affinity Publisher (ou Designer)

1. **Fichier** → **Nouveau** → format **A4** ou **Lettre**, unités mm, **traits de coupe** si impression avec fond perdu.  
2. **Placer** les images dans l’ordre ; calques maîtres pour fond noir / ornements récurrents (cf. slots 1B, 1D, 2A–2C du blueprint).  
3. Blocs texte dans la zone **marge sûre** ; images plein fond en débord si requis.  
4. **Fichier** → **Exporter** → **PDF** ; profil **PDF/X** ou preset imprimeur si demandé ; embarquer / décrire les métadonnées selon la boîte de dialogue.  
5. Validation + copie vers `public/encyclopedie.pdf` après revue.

### Adobe InDesign

1. Document **une page** ou **facing pages** selon la maquette ; format A4/Lettre, **gouttière** ≥ 12 mm si reliure.  
2. **Fichier** → **Placer** les PNG en séquence ; utiliser **Grille d’alignement** et repères pour marges sûres.  
3. **Fichier** → **Informations sur le document** pour titre, auteur, mots-clés.  
4. **Fichier** → **Exporter** → **Adobe PDF (impression)** ou **Interactif** selon l’usage ; vérifier compression images et profil CMJN vs RVB.  
5. Export final validé → `peltiez/public/encyclopedie.pdf`.

---

## Chemin minimal Node (ce dépôt)

Le package `peltiez` inclut déjà **pdfkit** en `devDependency`. Le script suivant assemble **uniquement** des PNG existants (aucune génération graphique).

### Prérequis

```bash
cd peltiez
npm install
```

### Commande

```bash
npm run docs:assemble-codex-pdf
```

Par défaut :

- **Entrée** : `../../assets/codex-encyclopedie` (racine du repo, depuis `peltiez/`).  
- **Sortie** : `docs/encyclopedie/codex-assembled-preview.pdf` (aperçu local — **ne remplace pas** automatiquement `public/encyclopedie.pdf`).

Options :

```bash
node ./scripts/assemble-codex-pdf.mjs --input "C:/chemin/vers/png" --output "./docs/encyclopedie/ma-version.pdf"
```

Variables d’environnement (optionnel) : `CODEX_ENCYCLOPEDIE_INPUT`, `CODEX_ENCYCLOPEDIE_OUTPUT`.

Si **aucun** fichier `.png` n’est trouvé dans le dossier d’entrée, le script affiche un message et se termine sans erreur (no-op).

Une fois le PDF validé humainement, copier ou renommer vers `peltiez/public/encyclopedie.pdf` selon votre flux de déploiement.

---

## Note SCALE (revue humaine et Git)

- Valider rendu, métadonnées, pagination et contrastes **avant** poussée sur `origin`.  
- Éviter `git add .` ; préférer `git add <chemins>` pour des commits traçables.
