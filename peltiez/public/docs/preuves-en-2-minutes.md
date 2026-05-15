# Preuves en 2 minutes — CirculAI / EGOR69

**Objectif :** vérifier l’existence des livrables **sans croire sur parole** — URL, dépôt Git, PDF, docs en ligne. Cochez chaque point en direct (2 à 3 minutes).

> **Lien rapide depuis le Codex investisseur :** cette page complète le résumé exécutif par une checklist actionnable.

---

## Checklist vérifiable

- [ ] **Site production** — [https://circulai-copy.vercel.app](https://circulai-copy.vercel.app) (build Vercel depuis le monorepo `la-finale` ; preview locale possible via déploiement `peltiez` sur branche courante)
- [ ] **`GET /` → 200** — [https://circulai-copy.vercel.app/](https://circulai-copy.vercel.app/) (accueil SPA, pas d’erreur réseau)
- [ ] **`GET /marketplace` → 200** — [https://circulai-copy.vercel.app/marketplace](https://circulai-copy.vercel.app/marketplace) (liste marketplace charge)
- [ ] **Section Encyclopédies à l’accueil** — [https://circulai-copy.vercel.app/#accueil-encyclopedies](https://circulai-copy.vercel.app/#accueil-encyclopedies) (tuiles PDF + Codex)
- [ ] **PDF encyclopédie** — [https://circulai-copy.vercel.app/encyclopedie.pdf](https://circulai-copy.vercel.app/encyclopedie.pdf) (réponse **200**, fichier volumineux : patience au téléchargement)
- [ ] **Dépôt GitHub** — [github.com/ChefPeltiex/la-finale](https://github.com/ChefPeltiex/la-finale) — historique public, docs sous `peltiez/docs/`
- [ ] **Commits récents (exemples)** — [`817d2ee`](https://github.com/ChefPeltiex/la-finale/commit/817d2ee) final-pack · [`5ce77f6`](https://github.com/ChefPeltiex/la-finale/commit/5ce77f6) Vercel npm · [`4478e7d`](https://github.com/ChefPeltiex/la-finale/commit/4478e7d) SPA routing · [`205dc3c`](https://github.com/ChefPeltiex/la-finale/commit/205dc3c) dossier plateforme (voir `git log -5` en local)
- [ ] **Codex investisseur** — [https://circulai-copy.vercel.app/docs/investisseur](https://circulai-copy.vercel.app/docs/investisseur)
- [ ] **Codex rituel** — [https://circulai-copy.vercel.app/docs/rituel](https://circulai-copy.vercel.app/docs/rituel)
- [ ] **Codex magique** — [https://circulai-copy.vercel.app/docs/magique](https://circulai-copy.vercel.app/docs/magique)
- [ ] **Alliance IA · OMÉGA** — [https://circulai-copy.vercel.app/docs/alliance](https://circulai-copy.vercel.app/docs/alliance)
- [ ] **Companion SHA256** — inventaire `peltiez/docs/companion.md` (37 planches PNG, empreinte **sha256_fichier** par asset ; régénération : `node scripts/generate_companion.cjs`)
- [ ] **Vercel — Root Directory** — dans les réglages du projet : **`peltiez`** (obligatoire en monorepo ; sinon le build pointe la racine vide)

---

## Script 45 s (Dominic — version neutre)

« CirculAI est une initiative pour rendre l’économie circulaire opérationnelle via une application web, une production documentaire (PDF), et une gouvernance de développement traçable.  
Je propose un pilote à périmètre restreint avec des indicateurs simples : délais, coûts, qualité de données.  
La démonstration s’appuie sur des artefacts publics vérifiables : URL, dépôt, et livrables associés. »

*(Version 90 s et questions de cadrage pilote : `circulai-final/final-pack.md` ou Codex investisseur.)*

---

## Ce qui n’est **PAS** encore prouvé

| Sujet | Statut honnête |
|--------|----------------|
| **Auth production** | Parcours compte / session à valider sur environnement cible (ne pas présenter comme audité). |
| **Revenus / MRR** | Aucun chiffre commercial affirmé — Stripe et offres documentées, pas de traction monétisée publiée. |
| **Impact tonnes CO₂ / déchets évités** | Pas de métriques d’impact environnemental **sourcées** en vitrine — méthode pilote d’abord. |

---

## Demande pilote

**Un pilote de 90 jours** avec un partenaire qui apporte un **cas réel** (un flux, un inventaire, une équipe), un **décideur unique** et un **budget minimal**. Succès mesuré sur **trois KPI** : temps d’un cycle typique, coût marginal du flux pilote vs. statu quo, qualité et traçabilité des données — sans promesse de scale ni de conformité non auditée. CirculAI livre des **artefacts vérifiables** aujourd’hui ; le pilote prouve la valeur opérationnelle demain.

---

## Scannez (liens directs — pas d’image QR requise)

| Libellé | URL |
|---------|-----|
| Site | https://circulai-copy.vercel.app |
| Preuves (cette page) | https://circulai-copy.vercel.app/docs/preuves |
| PDF | https://circulai-copy.vercel.app/encyclopedie.pdf |
| GitHub | https://github.com/ChefPeltiex/la-finale |
| Investisseur | https://circulai-copy.vercel.app/docs/investisseur |

---

*Sources détaillées : `peltiez/docs/proofs.md`, `peltiez/docs/codex-investisseur.md`, `circulai-final/final-pack.md`.*
