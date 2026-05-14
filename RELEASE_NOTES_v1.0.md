# Notes de version v1.0 — Codex / encyclopédie PDF (CirculAI)

**Langue du document :** français (résumé anglais en fin de fichier).

## Contexte

La version **v1.0** documente la chaîne de production et de diffusion du PDF de l’encyclopédie visuelle CirculAI (projet Codex), ainsi que l’intégration côté site. Le contenu encyclopédique **complet** peut rester en **placeholder** jusqu’à livraison éditoriale finale ; les artefacts décrits ici structurent le travail et la validation (dont revue **SCALE** / humaine).

## Livrables documentation

| Élément | Emplacement |
|---------|-------------|
| Gabarit unique (métadonnées, format, nommage, ordre des pages, déploiement) | `peltiez/docs/codex-pdf-blueprint.md` |
| Guide d’assemblage opérationnel (liste de pages, checklist métadonnées, DPI/marges, Canva / Affinity / InDesign, script Node optionnel) | `peltiez/docs/encyclopedie/README.md` |

## Site et fichier public

- **Placeholder PDF** et **bouton / lien de téléchargement** sur le site : déjà intégrés dans le projet `peltiez` (commit de référence : `d38e2b3`).
- Fichier attendu sous la racine publique du build : `encyclopedie.pdf` (chemin source typique : `peltiez/public/encyclopedie.pdf`).

## URL de diffusion (schéma)

Lien direct de téléchargement ou vérification en production (adapter au domaine Vercel réel du projet) :

`https://circulai-copy.vercel.app/encyclopedie.pdf`

## Assemblage automatisé (optionnel)

Un script Node réutilise **pdfkit** (déjà présent en `devDependency` de `peltiez`) pour assembler des PNG existants en un PDF de **prévisualisation** ; voir `peltiez/docs/encyclopedie/README.md` et la commande `npm run docs:assemble-codex-pdf` depuis `peltiez/`. Sans images dans le dossier configuré, le script se contente d’un message explicite (no-op).

## SCALE — validation humaine et Git

- **Revue humaine** : valider le PDF final (rendu, métadonnées, pagination, contrastes) avant envoi sur `origin`.
- **Staging** : éviter `git add .` ; indexer uniquement les chemins voulus pour des commits lisibles et traçables.

## English summary

v1.0 documents the Codex PDF pipeline: blueprint at `peltiez/docs/codex-pdf-blueprint.md`, assembly guide at `peltiez/docs/encyclopedie/README.md`, placeholder `encyclopedie.pdf` plus download entry on the site (`d38e2b3`), and the public URL pattern `https://circulai-copy.vercel.app/encyclopedie.pdf`. Full encyclopedia content may remain placeholder until shipped; human/SCALE review applies before pushing final binaries.
