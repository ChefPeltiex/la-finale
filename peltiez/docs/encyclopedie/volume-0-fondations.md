# Encyclopédie hybride — Volume 0 · Fondations

**Auteur :** Dominic Pelletier · **Langue :** fr-CA · **Statut :** plan éditorial (mai 2026)  
**Public :** lecteurs, éditeurs, proches — **pas** dossier municipal minimal  
**Lien produit :** `public/encyclopedie.pdf` · blueprint [`../codex-pdf-blueprint.md`](../codex-pdf-blueprint.md)

---

## Ce qu’est le Volume 0 (et ce qu’il n’est pas)

| Volume 0 **est** | Volume 0 **n’est pas** |
|------------------|------------------------|
| Une **porte d’entrée** lisible (80–120 pages texte + quelques planches) | Tout le repo exporté en PDF |
| Un **essai hybride** : journal + atlas + système nommé | « La vérité ultime » ni manuel scientifique |
| La **charte** des deux mondes (CirculAI / Egor) | Le kit pilote mairie (voir `public/docs/circulai/`) |
| Une œuvre **transmissible** (génération suivante) | Une preuve de ROI municipal |

**Sous-titre recommandé (couverture) :**  
*« Atlas personnel d’une économie circulaire — monde concret et monde du rêve »*

**Avertissement (page 2, obligatoire) :**  
*« Ouvrage de création et de réflexion. Les équations et univers numériques sont des modèles de travail et des métaphores — pas des conseils médicaux, juridiques ou des promesses de résultat. Le pilote territorial CirculAI se valide sur le terrain, pas dans ce livre. »*

---

## Architecture du Volume 0 (7 chapitres)

Budget indicatif : **~15 pages / chapitre** en prose + **2–4 planches** issues du Codex (slots 1A–3C).

### Chapitre 0 — Couverture & seuil (4 pages)

- Titre, sous-titre, auteur, date, avertissement (ci-dessus).
- **Pourquoi ce livre existe** (1 page) : fatigue des outils dispersés ; envie de relier territoire, objet, sens.
- **Comment lire** (½ page) : symboles = fiction documentaire ; chiffres municipaux = renvoi au kit CirculAI.

### Chapitre 1 — Origine (15 pages)

**Titre :** *Du carnet au code*

- Limoilou, Québec ; genèse sans mythifier.
- Ce qui a déclenché CirculAI (circularité concrète).
- Ce qui a déclenché Egor (besoin de rêve, de jeu, d’appartenance).
- **Une page** : « Ce que je ne demande pas aux institutions » (aligné lettre pilote).

*Planche suggérée :* couverture Codex (slot 1A).

### Chapitre 2 — Les deux mondes (12 pages)

**Titre :** *Concret et fantaisiste — une grammaire*

| Monde | Métaphore | Outil aujourd’hui |
|-------|-----------|-------------------|
| Concret | Atelier, ville, preuve | CirculAI · Base44 · kit |
| Fantaisiste | Verse, rêve, codex | Egor69 · Vercel · `/entrer` |

- Règle d’or : **ne pas mélanger les discours** (maire ≠ Verse).
- Schéma simple (ASCII ou planche 2B).

### Chapitre 3 — CirculAI, le chantier mesurable (18 pages)

**Titre :** *Intelligence circulaire*

- Problème : coordination locale, gaspillage, outils éparpillés.
- Solution : marketplace, réparation, Nature QC, pilote 90 j / 1 site / 3 preuves.
- Chiffres **publics** seulement (circularité ~2,5 %, déchets/hab — sources RECYC / Statistique QC).
- **Honnêteté** : pilote non démarré ; pas de faux avis ni CO₂ inventés.
- Renvoi : kit régional (liste des 4 docs essentiels, pas le texte intégral).

*Planches :* diagramme flux / économie (slots 5–7 si disponibles).

### Chapitre 4 — Egor, le vestibule culturel (15 pages)

**Titre :** *Jumeau numérique — exploration*

- Verse, encyclopédie, quêtes : **divertissement et sens**, pas service public.
- Psycho-social **nommé** : évasion virtuelle, rêves, communauté — sans promesse thérapeutique.
- Filiation **genre** (Lumières, encyclopédie, récit FR) — **sans** endossement d’auteur vivant.
- Lien Werber / Diderot : ½ page chacun (voir `docs/circulai/references-culturelles.md`).

*Planches :* 1–2 planches Verse / arc-en-ciel (slots 10–11).

### Chapitre 5 — Système nerveux (12 pages)

**Titre :** *Équations comme gouvernance (non comme physique)*

- Table simplifiée : matter-flux, softmax, confiance — **statut** live / partiel / roadmap.
- Phrase fixe : *« À calibrer sur le pilote ; jamais affiché comme acquis sans données. »*
- Renvoi technique : `docs/circulai/equations-systeme.md` (résumé 2 pages max).

### Chapitre 6 — Transmission (10 pages)

**Titre :** *Ce qui peut surviver*

- Pourquoi un livre / PDF alors qu’une app est difficile.
- Ce que tu transmets aux générations : méthode, éthique, questions — pas un empire.
- **Volume 1** (teaser) : encyclopédie du territoire québécois ; carnets ; planches complètes.
- Colophon : dépôt Git, date, licence renvoi `LICENSE` / `NOTICE`.

### Annexes (8–15 pages)

- A. Glossaire (20 termes max : CirculAI, Egor, pilote, preuve, Verse, OBNL…).
- B. Chronologie 2025–2026 (faits, pas légende).
- C. Index des planches Codex utilisées.
- D. Contact & kit (URL `/circulai`, pas promesse de domaine mort).

---

## Matériel déjà dans le dépôt (à réutiliser, pas réécrire)

| Source | Usage Volume 0 |
|--------|----------------|
| `docs/circulai/references-culturelles.md` | Ch. 4 (½ page) |
| `docs/circulai/equations-systeme.md` | Ch. 5 (résumé) |
| `docs/circulai/lettre-pilote-municipal.md` | Ch. 1 ou 3 (encadré « professionnel ») |
| `assets/codex-encyclopedie/*.png` | Planches |
| `public/encyclopedie.pdf` | **Aperçu** — Volume 0 = texte + sélection planches |

---

## Calendrier réaliste (solo, 10 h / semaine)

| Semaine | Livrable |
|---------|----------|
| 1 | Ch. 0 + 1 (brouillon brut, dictée vocale OK) |
| 2 | Ch. 2 + 3 |
| 3 | Ch. 4 + 5 |
| 4 | Ch. 6 + annexes → export PDF test (Canva / Affinity) |
| 5 | Relecture : couper 20 %, vérifier **zéro** faux chiffre |

**Objectif Volume 0 :** un PDF que tu peux envoyer à **un** lecteur beta ou **un** éditeur comme *extrait*, pas l’œuvre complète.

---

## Phrase d’accroche éditeur (courriel)

> *« Volume 0 d’une encyclopédie hybride franco-québécoise : essai documentaire + atlas visuel sur l’économie circulaire et le numérique citoyen. Une moitié outil territorial (CirculAI), une moitié univers d’exploration (Egor69) — explicitement séparées. 100 pages, reproductions noir & or, public : culture, ESS, écologie, humanités numériques. »*

---

## Lien avec le pilote (ne pas confondre)

- **Mairie / OBNL cette semaine :** lettre + Base44 + PDF kit — **pas** Volume 0.
- **Volume 0 :** parallèle, calme, transmission — le temps trie le reste.

---

## Texte rédigé (mai 2026)

Chapitres dans **`volume-0/`** → [index.md](./volume-0/index.md) (brouillon à relire par l'auteur).

---

*Document de travail — ajuster après retour d’un lecteur beta ou d’un éditeur.*
