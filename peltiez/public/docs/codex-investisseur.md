# CirculAI / EGOR69 — Résumé exécutif

→ **[Preuves en 2 minutes](/docs/preuves)** — checklist vérifiable (site, PDF, GitHub) sans croire sur parole.

**Document** : édition investisseur · Codex CirculAI v1.0  
**Porteur** : Dominic Pelletier · Québec / francophonie  
**Date** : mai 2026 · ~2 pages imprimées

---

## Problème et opportunité

L’économie circulaire reste souvent un discours : programmes, chartes et rapports sans chaîne d’exécution mesurable. Les acteurs publics, les ONG et les PME manquent d’outils simples pour **publier**, **échanger**, **réparer** et **documenter** leurs flux — avec une confiance basée sur des preuves, pas sur des promesses « vertes » non sourcées.

**Opportunité (prudente)** : un marché adressable progressif autour de la **réduction des pertes** (gaspillage, stocks dormants, friction logistique locale) et de la **traçabilité des données** sur des périmètres pilotes (une ville, une organisation, un inventaire). CirculAI ne revendique pas une part de marché chiffrée inventée : l’hypothèse est qu’un **pilote 90 jours** sur un cas réel permet de valider temps, coût et qualité des données avant toute extension.

---

## Solution

**CirculAI / EGOR69** est une plateforme web modulaire qui rend la circularité **opérationnelle** :

| Pilier | Rôle |
|--------|------|
| **Marketplace** | Don, échange, réparation, annonces locales — parcours utilisateur déployé. |
| **Atlas vivant** | Fiches et savoirs (faune, flore, hubs thématiques) — contenu structuré, extensible. |
| **Preuves** | Dépôt versionné, documentation (`proofs.md`), pipeline SCALE (délégation contrôlée, revue humaine). |
| **Pilote 90 jours** | Un flux, un inventaire, une équipe, revue hebdomadaire, livrables vérifiables. |

L’architecture technique (Vite, React, API Express pour paiements et leads validés) privilégie la **reproductibilité** et la **transparence** : pas de métriques fictives en vitrine, expériences immersives clairement étiquetées.

---

## Traction et livrables vérifiables

Les éléments suivants sont **consultables sans démo orale** :

| Livrable | Référence |
|----------|-----------|
| **Site déployé** | [https://circulai-copy.vercel.app](https://circulai-copy.vercel.app) — build depuis `peltiez/` (Root Directory Vercel). |
| **Dépôt GitHub** | [github.com/ChefPeltiex/la-finale](https://github.com/ChefPeltiex/la-finale) — historique commits, docs, scripts. |
| **Encyclopédie PDF** | `/encyclopedie.pdf` — chaîne assets PNG → assemblage documenté. |
| **Companion** | Index des planches et métadonnées (`docs/companion.md`, `public/docs/`). |
| **Routage SPA** | Correctif documenté (commit `4478e7d`, `vercel.json`). |

**À compléter avec métriques réelles** (utilisateurs actifs, annonces, villes pilotes) — volontairement non inventées dans ce document.

---

## Modèle économique (cadre, sans chiffres fictifs)

| Levier | Description |
|--------|-------------|
| **Take rate** | Commission sur transactions marketplace — **à calibrer** selon pilote et conformité locale. |
| **Pilote** | Forfait ou co-financement programme (90 jours, périmètre restreint) — objectif : preuve, pas scale immédiat. |
| **Abonnement / soutien** | Offres Stripe documentées sur la plateforme — activation selon feuille de route. |
| **B2B / déploiement** | Licence, formation, white-label — **après** validation des 3 KPI pilote. |

Aucun revenu annuel ou MRR n’est affirmé ici : la priorité est **livrable vérifiable → pilote mesuré → modèle recalé**.

---

## Équipe et gouvernance

- **Dominic Pelletier** — fondateur, produit, narration maîtrisée, propriété intellectuelle documentée.  
- **Protocole SCALE** — orchestration IA avec revue humaine, commits ciblés, traçabilité (`docs/scale-protocol-v1.1.md`, fiche 1 page SCALE).  
- **Gouvernance dépôt** — documentation preuves, checklists qualité (`verify`, Playwright smoke), pas de « bricolage » non versionné.

L’équipe reste **légère** : renforts ciblés (design, conformité, partenaire terrain) selon périmètre du pilote, pas une structure fictive.

---

## Demande

**Un pilote de 90 jours** avec un partenaire capable de débloquer **accès données**, **décideur unique** et **budget minimal**.

**Trois KPI contractuels** :

1. **Temps** — délai d’un cycle typique (publication → contact → clôture ou réparation).  
2. **Coût** — coût marginal d’un flux pilote vs. statu quo (mesure simple, pas d’ERP complet requis).  
3. **Qualité des données** — complétude, cohérence, traçabilité de l’inventaire ou du flux choisi.

**Livrables attendus** : revue hebdomadaire, artefacts versionnés, décision go/no-go à J90.

---

## Risques et mitigations

| Risque | Mitigation |
|--------|------------|
| Surface produit large | Prioriser **3 parcours** ; carte du site et mode simple. |
| Adoption lente | Pilote **une** organisation, **un** flux ; critères d’arrêt clairs. |
| Dépendance IA | Assistance uniquement ; décision humaine ; pas de promesses médicales/juridiques. |
| Deep links / déploiement | `vercel.json`, Root Directory `peltiez`, smoke HTTP documenté. |
| Perception « trop cosmique » | Édition investisseur sobre ; expériences immersives étiquetées. |

---

## Prochaines étapes (6–12 mois)

1. **M0–M3** — Clôturer pilote 90 jours ; publier rapport KPI ; décider extension géographique ou sectorielle.  
2. **M3–M6** — Durcir marketplace + hub réparation ; intégrations partenaires (selon données pilote).  
3. **M6–M12** — Modèle économique recalé sur métriques réelles ; encyclopédie PDF enrichie ; conformité et sécurité renforcées (audit ciblé).

---

## Contact et lecture complémentaire

- **Site** : [circulai-copy.vercel.app](https://circulai-copy.vercel.app)  
- **Routes Codex** : `/docs/investisseur` · `/docs/rituel`  
- **Docs** : `peltiez/docs/proofs.md` · `scale-ai-fiche-1-page.md` · `final-pack.md`

*CirculAI transforme la circularité en livrables mesurables — pas en slides.*
