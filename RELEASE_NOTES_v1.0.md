# Notes de version v1.0 — Codex / Encyclopédie (la-finale)

**Version :** `v1.0` (placeholder de contenu PDF tant que `encyclopedie.pdf` n’est pas remplacé par l’export final InDesign/Canva ; les actifs et le blueprint sont la base éditoriale.)

**Dépôt :** [ChefPeltiex/la-finale](https://github.com/ChefPeltiex/la-finale)

---

## FR — Faits marquants

- **Blueprint PDF** : gabarit unique (`peltiez/docs/codex-pdf-blueprint.md`) — format, métadonnées, ordre des pages, nommage des visuels, note SCALE Git.
- **Assemblage** : guide opérationnel (`peltiez/docs/codex-pdf-assembly.md`) — séquence de pages alignée sur le blueprint, inventaire des PNG sous `assets/codex-encyclopedie/`, options InDesign / Canva / script placeholder.
- **Diffusion web** : le site Vite/React (`peltiez/`) sert `public/encyclopedie.pdf` à l’URL **`/encyclopedie.pdf`** ; l’accueil propose un bouton **« Télécharger l’encyclopédie (PDF) »** (style codex noir/or, sans emoji dans ce CTA).
- **Automatisation légère** : `pnpm run encyclopedie:placeholder-pdf` (dans `peltiez/`) régénère un PDF minimal de secours via **pdfkit** (déjà présent).

### Contenu livré (v1.0)

| Élément | Emplacement |
|---------|-------------|
| PDF (placeholder ou final) | `peltiez/public/encyclopedie.pdf` |
| Visuels Codex | `assets/codex-encyclopedie/*.png` |
| Blueprint | `peltiez/docs/codex-pdf-blueprint.md` |
| Guide d’assemblage | `peltiez/docs/codex-pdf-assembly.md` |

### Lien site (schéma)

Après déploiement Vercel (ou équivalent) du projet frontend :

`https://<votre-domaine>/encyclopedie.pdf`

Exemple avec le domaine par défaut Vercel : `https://<nom-du-projet>.vercel.app/encyclopedie.pdf` — vérifier le nom exact dans le tableau de bord Vercel.

---

## EN — Short summary

- **v1.0** ships the **Codex PDF blueprint**, an **assembly guide**, **encyclopedia PNG assets** under `assets/codex-encyclopedie/`, and a **downloadable** `encyclopedie.pdf` exposed at **`/encyclopedie.pdf`** from the Vite app’s `public/` folder.
- The homepage includes a **French** download CTA aligned with the **black/gold** codex look.
- Replace the placeholder PDF with the final print-ready export when editorial sign-off is complete.

---

## SCALE — Git et revue

- **Revue humaine** : valider rendu PDF, contrastes, pagination et métadonnées avant diffusion large.
- **Staging** : préférer `git add <chemins explicites>` à `git add .` pour des commits lisibles (voir blueprint §8).
- **Intégrité** : ne pas désactiver TLS ni affaiblir la chaîne de build pour forcer un déploiement.

---

*Document destiné au copier-coller dans l’interface GitHub Releases (tag `v1.0`).*
