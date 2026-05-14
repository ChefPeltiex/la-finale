# Blueprint PDF — Encyclopédie visuelle CirculAI (Codex)

**Version du document :** v1.0 (placeholder — mettre à jour à chaque révision majeure du gabarit ou du contenu éditorial.)

Ce fichier est la **source unique de vérité** pour l’assemblage du PDF de l’encyclopédie visuelle CirculAI (projet Codex). Toute exportation, automatisation ou livrable imprimé doit s’y conformer ou documenter une dérogation explicite.

---

## 1. Finalité et périmètre

- **Objectif** : définir métadonnées, ordre des pages, conventions d’actifs et contraintes techniques pour produire un PDF cohérent (impression ou diffusion web) à partir des visuels et du texte de l’encyclopédie CirculAI.
- **Public** : équipe éditoriale, design, intégration et déploiement (Vercel / dépôt GitHub).
- **Hors périmètre v1.0** : contenu rédactionnel détaillé des chapitres (référencé par emplacement seulement).

---

## 2. Métadonnées du document (outil d’export)

À renseigner dans l’outil d’export PDF (InDesign, Affinity, script, etc.) :

| Champ | Valeur recommandée |
|--------|---------------------|
| **Titre** | Encyclopédie visuelle CirculAI |
| **Sous-titre** | Codex — édition CirculAI (ajuster selon l’édition) |
| **Auteur** | Dominic Peltier |
| **Créateur / organisation** | CirculAI |
| **Sujet** | Encyclopédie visuelle et cadre éditorial CirculAI (Codex) |
| **Mots-clés** | CirculAI, Codex, encyclopédie, économie circulaire, visualisation |
| **Langue** | `fr-CA` |
| **Licence / avis** | Pointer vers la racine du dépôt : fichier `LICENSE`, `NOTICE` ou équivalent à la racine du repo `ChefPeltiex/la-finale` (voir section GitHub). Ne pas dupliquer le texte légal dans le PDF sans validation juridique. |

---

## 3. Format technique

| Paramètre | Spécification |
|-----------|----------------|
| **Format de page** | A4 **ou** Lettre US — **choisir une norme par édition** et la figer pour toute la chaîne (fonds, repères, export). |
| **Fond** | Noir (#000000 ou équivalent CMJN selon profil d’impression). |
| **Typographie cible** | Titres et accents : **or** (tons chauds, lisibilité sur fond noir). Corps et légendes : **crème** / off-white (éviter le blanc pur en impression si le papier le impose). |
| **Résolution (DPI)** | **Impression** : images raster 300 DPI minimum à la taille d’usage finale ; logos/vectoriels en vectoriel si possible. **Web / écran** : 150–200 DPI acceptable pour un PDF « léger » ; privilégier vectoriel + compression adaptée. |
| **Marges sûres** | **Intérieur** : ≥ 12 mm (relieure / gouttière). **Extérieur, haut, bas** : ≥ 10 mm pour le texte et les éléments critiques. Étendre les textures plein fond au **fonds perdu** (3 mm) si impression commerciale. |
| **Profil couleur** | Impression : CMJN + profil papier fourni par l’imprimeur ; écran : sRVB. Documenter le profil dans la fiche de livraison de l’édition. |

---

## 4. Nommage des actifs visuels

**Modèle de fichier :** `codex-encyclopedie-{code}.png`  
où `{code}` suit la grille section/sous-section (ex. `1A`, `2C`).

### 4.1 Section 1 — Couverture et socle (1A–1D)

| Code | Rôle |
|------|------|
| **1A** | Couverture avant — composition principale (titre, hiérarchie visuelle). |
| **1B** | Éléments de cadre, halo ou ornement réutilisable pour pages intérieures. |
| **1C** | Symbole / mandala CirculAI (version adaptée couverture ou intérieur). |
| **1D** | Texture de fond ou panneau pour pages de transition. |

### 4.2 Section 2 — Page de garde (2A–2C)

| Code | Rôle | Réemploi |
|------|------|----------|
| **2A** | Texture et zone de titre (page de garde). | Réutiliser **1D** comme base texture si cohérent visuellement. |
| **2B** | Cadre / halo décoratif. | Réutiliser **1B** (variante recadrée ou teinte). |
| **2C** | Symbole CirculAI / mandala centré. | Réutiliser **1C** (échelle et contraste adaptés au noir de fond). |

### 4.3 Sections 3 à 12 — Emplacements éditoriaux (placeholder)

Table concise : une ligne par section ; sous-codes **A–C** = emplacements types (ouvrir chapitre, figure, pleine page).

| Section | Codes (slots) | Usage éditorial (placeholder) |
|---------|----------------|--------------------------------|
| **3** | 3A–3C | Ouverture de chapitre I + figures. |
| **4** | 4A–4C | Ouverture de chapitre II + figures. |
| **5** | 5A–5C | Ouverture de chapitre III + figures / diagrammes. |
| **6** | 6A–6C | Chapitre IV — planches diagrammes. |
| **7** | 7A–7C | Chapitre V — infographies. |
| **8** | 8A–8C | Chapitre VI — cas ou schémas. |
| **9** | 9A–9C | Chapitre VII — synthèses visuelles. |
| **10** | 10A–10C | Glossaire — lettrines / pictogrammes. |
| **11** | 11A–11C | Annexes — tableaux, sources, références visuelles. |
| **12** | 12A–12C | Colophon, **dos (spine)** si export séparé, **clôture** / page finale. |

*(Affiner les intitulés de chapitres dans le plan éditorial sans changer le préfixe `codex-encyclopedie-`.)*

---

## 5. Ordre des pages (séquence de référence)

| Ordre | Page / bloc |
|-------|-------------|
| 1 | Couverture (avant) |
| 2 | Page de garde |
| 3 | Copyright / mentions légales |
| 4 | Introduction |
| 5 | Table des matières |
| 6+ | Chapitres (corps) |
| — | Planches diagrammes (insérées selon plan éditorial, souvent après chapitres concernés) |
| — | Glossaire |
| — | Annexes |
| — | Colophon |
| — | Tranche / **spine** (optionnel — souvent fichier ou calque séparé pour reliure) |
| — | Page de clôture |
| — | Quatrième de couverture (optionnel) |

---

## 6. Déploiement Vercel (projet circulai-copy)

- **Fichier public** : placer le PDF final sous `public/encyclopedie.pdf` dans le projet Vercel **circulai-copy**.
- **URL publique** (schéma) : `https://<domaine-du-projet>.vercel.app/encyclopedie.pdf`  
  Exemple si le domaine par défaut Vercel est conservé : `https://circulai-copy.vercel.app/encyclopedie.pdf` (vérifier le nom exact du déploiement dans le tableau de bord Vercel).

### Bouton de téléchargement minimal (HTML)

```html
<a href="/encyclopedie.pdf" download>Télécharger l’encyclopédie (PDF)</a>
```

### Équivalent minimal (React)

```tsx
export function DownloadEncyclopedia() {
  return (
    <a href="/encyclopedie.pdf" download>
      Télécharger l’encyclopédie (PDF)
    </a>
  );
}
```

*(Pour un libellé accessible, ajouter `aria-label` et style cohérent avec le design system du site.)*

---

## 7. Référentiel GitHub et stockage des actifs

- **Dépôt** : [ChefPeltiex/la-finale](https://github.com/ChefPeltiex/la-finale)
- **Dossier d’actifs (optionnel)** : `assets/codex-encyclopedie/` — y versionner ou référencer les PNG `codex-encyclopedie-*.png` et les sources maquettes si la taille du dépôt le permet ; sinon lien vers stockage d’artefacts (releases, LFS) documenté dans le README du dossier.

---

## 8. Note SCALE — revue humaine et Git

- **Revue humaine** : valider le PDF (rendu, métadonnées, pagination, contrastes) **avant** tout envoi sur `origin`.
- **Staging** : éviter `git add .` sauf intention explicite ; préférer `git add <chemins>` pour des commits traçables.
- **Exemple de message de commit** : `docs: add Codex PDF blueprint for CirculAI encyclopedia`

---

## 9. Historique des révisions (à tenir à jour)

| Version | Date | Auteur | Résumé |
|---------|------|--------|--------|
| v1.0 | — | — | Création initiale du blueprint. |
