# Main-d’œuvre — ce que 40 jours solo ont remplacé

**Auteur :** fondateur unique · **Durée déclarée :** ~40 jours calendaires (intensif)  
**Statut :** **estimation méthodologique** — pas une facture certifiée ni un audit RH.

---

## 1. Inventaire technique vérifiable (dépôt `peltiez`)

| Mesure | Valeur (mai 2026) | Comment vérifier |
|--------|-------------------|------------------|
| Fichiers `src` (.js / .jsx / .ts / .tsx) | **461** | `Get-ChildItem -Recurse src` |
| Lignes de code source (`src`) | **~61 165** | comptage dépôt |
| Fichiers documentation (`docs` + `public/docs`) | **~71** markdown | dépôt |
| Lignes documentation | **~9 895** | comptage dépôt |
| Routes marketing + app | Accueil, marketplace, atlas, Nature QC (12 portails), Verse 3D, boutique, pilote 90 j, entreprises, codex multiples | `src/App.jsx` |
| Déploiement | Vercel, sitemap, SEO, e2e smoke | `package.json`, `e2e/` |

**Historique Git public :** [github.com/ChefPeltiex/la-finale](https://github.com/ChefPeltiex/la-finale) — commits traçables.

---

## 2. Décomposition fonctionnelle (équivalent équipe)

| Lot | Livrables inclus | Heures estimées (fourchette) |
|-----|------------------|------------------------------|
| **Architecture & routes SPA** | React, Vite, navigation, SEO, sitemap | 80 – 120 h |
| **Marketplace & parcours citoyen** | Listings, publier, profil, game hooks | 60 – 100 h |
| **Portail Nature Québec** | 12 portails, données, hub, docs kit | 50 – 80 h |
| **Verse 3D (R3F)** | WorldScene, galaxies, bloom, portails, pause onglet | 40 – 70 h |
| **Boutique & produits numériques** | `digitalProducts`, Stripe patterns, `/boutique` | 30 – 50 h |
| **Entreprises & pilote 90 j** | `/entreprises`, `/pilote`, preuves | 25 – 40 h |
| **Codex & encyclopédie** | PDF pipeline, pages markdown, assembly scripts | 40 – 60 h |
| **Docs investisseur / sécurité** | preuves, promesses, intégrations, terraform README | 30 – 50 h |
| **QA, build, correctifs** | verify, e2e, lint loops | 40 – 60 h |
| **Kit municipal Québec** | plans, lettre, démo, ce document | 25 – 40 h |
| **Total équivalent** | | **420 – 670 h** |

**En jours-personne (7 h productives / jour) :** **60 – 96 jours-personne** d’équipe classique.

**Réalisé en ~40 jours calendaires solo** → intensité équivalente à **1,5 – 2,4×** un rythme d’équipe linéaire (sans compter le coût d’épuisement — à surveiller).

---

## 3. Conversion en dollars (CAD) — fourchettes marché Québec

*Taux indicatifs 2025–2026 : dev senior 85–125 $/h · 3D web 90–130 $/h · rédaction tech 70–95 $/h · UX 75–110 $/h*

| Scénario | Calcul | Fourchette |
|----------|--------|------------|
| **Prudent** | 420 h × 85 $/h | **~35 700 $** |
| **Base** | 550 h × 100 $/h | **~55 000 $** |
| **Agence intégrée** | 670 h × 125 $/h + frais agence (~25 %) | **~105 000 – 130 000 $** |

**Équivalent « petite agence + spécialiste 3D »** sur **4–6 mois** calendaires → **60 000 – 150 000 $ CAD** est une fourchette **crédible** pour un périmètre comparable.

---

## 4. Ce que cela signifie pour un partenaire

- Le **code et la vision produit** sont déjà **amortis** par le fondateur.  
- Les partenaires n’achètent pas « un mockup » : ils s’engagent sur **activation terrain**, **preuves**, **réseau**, **financements**.  
- Le fondateur conserve le rôle : **architecte logiciel & vision** — pas relances commerciales quotidiennes (voir [Partenaires à approcher](/docs/circulai/partenaires)).

---

## 5. Limites de cette estimation

- Ne compte pas le **capital humain** passé (formation, essais abandonnés).  
- Ne remplace pas une **évaluation** par comptable ou investisseur.  
- Les lignes de code ne mesurent pas la **qualité UX** en production réelle — d’où le **pilote 90 jours**.

---

*CirculAI · transparence fondateur · `/docs/circulai-kit-regional`*
