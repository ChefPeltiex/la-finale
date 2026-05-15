# CirculAI / EGOR69 — Dossier plateforme

**Document destiné à Dominic Pelletier**  
**Édition** : mai 2026 · Québec / francophonie  
**Statut** : dossier investisseur et technique — honnête sur la phase pré-traction  
**Marque principale** : CirculAI · **Univers narratif** : EGOR69 (Egor / Igor 69)

---

## 1. Résumé exécutif

CirculAI est une initiative pour rendre l’économie circulaire **opérationnelle** : pas seulement des discours sur la durabilité, mais des parcours web, des documents vérifiables et une gouvernance de développement traçable. La plateforme associe une application **Vite + React** déployée sur Vercel, une **encyclopédie PDF** assemblée à partir de planches visuelles indexées par empreintes SHA256, un corpus documentaire riche dans le dépôt GitHub, et un protocole **SCALE** (délégation contrôlée à l’IA, revue humaine, reproductibilité des livrables).

**EGOR69** n’est pas une seconde marque concurrente : c’est l’univers narratif et éditorial — formules symboliques, rituels optionnels, alliance d’agents IA — qui donne une cohérence culturelle au produit sans remplacer la sobriété attendue d’un interlocuteur institutionnel. Dominic Pelletier en est le porteur : produit, narration maîtrisée, propriété intellectuelle documentée.

**Ce qui existe aujourd’hui (vérifiable sans démo orale).** Le site public [https://circulai-copy.vercel.app](https://circulai-copy.vercel.app) est construit depuis le sous-dossier `peltiez` du monorepo `la-finale`. Le routage SPA en production a été corrigé (commit `4478e7d`, `vercel.json`). L’encyclopédie est téléchargeable à `/encyclopedie.pdf`. Les éditions Codex sont accessibles en ligne (`/docs/investisseur`, `/docs/rituel`, `/docs/magique`, `/docs/alliance`) et en sources Markdown dans `peltiez/docs/`. Le companion indexe 37 planches PNG avec SHA256 par fichier (`docs/companion.md`).

**Ce qui n’est pas revendiqué.** Aucun chiffre d’utilisateurs actifs, de revenus annuels ou de part de marché n’est inventé dans ce dossier. Les expériences immersives (multivers, arènes, hubs ésotériques) existent dans le routeur mais sont clairement **hors périmètre pilote** lorsque le mode pilote est activé — elles servent la démonstration de richesse narrative, pas une promesse de traction immédiate.

**Demande centrale.** Un **pilote de 90 jours** sur un cas restreint (une organisation, un flux, un inventaire), mesuré sur **trois indicateurs contractuels** : **temps** (délai d’un cycle typique), **coût** (coût marginal du flux pilote vs. statu quo), **qualité des données** (complétude, cohérence, traçabilité). Livrables attendus : revue hebdomadaire, artefacts versionnés, décision go/no-go à J90.

**Positionnement en une phrase.** CirculAI transforme la circularité en **livrables mesurables** — site, PDF, dépôt, méthode SCALE — et non en slides vertes non sourcées.

**Lecture rapide pour Dominic.** Ce document synthétise `final-pack.md`, `codex-investisseur.md`, `proofs.md`, l’architecture routes/API, les modèles opérationnels et les évolutions UX récentes (cinq pôles de navigation, onboarding, recherche globale, section encyclopédies à l’accueil, mode pilote). Il est conçu pour être remis tel quel à un partenaire, un programme ou un conseiller, avec l’honnêteté requise sur la phase actuelle : **démo souveraine opérationnelle**, pas scale commercial prouvé.

---

## 2. Utilités — ce que les utilisateurs peuvent faire aujourd’hui

La plateforme est **large par design** : des centaines de routes SPA coexistent. Pour un nouvel utilisateur ou un investisseur, il faut distinguer le **noyau démontrable** du **laboratoire narratif**. Le tableau ci-dessous indique ce statut de manière transparente.

| Domaine | Parcours principal | Statut actuel |
|--------|-------------------|---------------|
| **Marketplace** | `/marketplace` — don, échange, réparation, annonces | **Déployé** — parcours UI complet ; volume d’annonces réel à compléter avec métriques pilote |
| **Publication** | `/publier` — création d’annonce | **Déployé** — formulaire et flux publication ; composant `PublishNextSteps` guide la suite |
| **Atlas vivant** | `/atlas` — fiches, savoirs, exploration | **Déployé** — contenu structuré ; API Express pour fiches vivantes et conversion scans |
| **Encyclopédie PDF** | `/encyclopedie.pdf` (fichier statique) | **Production** — 37 planches PNG + pages texte optionnelles ; scripts `encyclopedie:assemble-full` |
| **Codex web** | `/docs/investisseur`, `/docs/rituel`, `/docs/magique`, `/docs/alliance` | **Production** — rendu React depuis Markdown source |
| **Cartographie** | `/carte-site` — glossaire et liens | **Déployé** — alimenté par `siteGraph.js` |
| **Hub réparation** | `/hub-reparation` | **Déployé** — aligné pôle « Agir » |
| **Bien-être** | `/wellness`, `/wellness-quests`, lexiques | **Déployé** — contenu éditorial ; **pas** substitut médical (disclaimers) |
| **Jeux / quêtes** | `/jeu`, `/daily-challenges`, arènes, campagnes | **Démo** — engagement narratif ; KPI jeu non contractuels en pilote |
| **3D / Panthéon** | `/pantheon-3d`, `/pantheon-renders` | **Démo** — Three.js / R3F ; dépend matériel client |
| **Hubs thématiques** | Faune, flore, minéraux, chimie, mythologies, etc. | **Contenu** — extensible ; profondeur variable par hub |
| **Paiements** | `/pricing`, `/abonnement`, Stripe | **Technique prêt** — checkout, Payment Intent, webhook ; activation commerciale selon feuille de route |
| **CRM / leads** | formulaires → `POST /api/crm/lead` | **Backend** — stockage local NDJSON ; à relier CRM partenaire en pilote |
| **Métriques live** | `/plateforme/temps-reel`, `GET /api/platform/metrics-live` | **Démo contrôlée** — pas de métriques fictives présentées comme réelles |
| **Admin / modération** | `/admin`, sentinelle, transparency | **Interne** — réservé opérateur |
| **Multivers / cosmique** | underworld, etherealm, cosmic-portal, etc. | **Immersif** — hors scope pilote par défaut |

### Marketplace et circulation des biens

L’utilisateur peut parcourir la marketplace, filtrer les annonces, et accéder au flux de publication. L’intention produit est locale et circulaire : **donner**, **échanger**, **faire réparer** plutôt qu’acheter neuf par défaut. Le rituel éditorial (`codex-rituel.md`) rappelle l’honnêteté des descriptions — aligné avec la charte « pas de dark patterns ». En pilote, ce parcours est l’un des trois candidats prioritaires avec l’atlas et la documentation investisseur.

### Atlas et savoirs

L’atlas regroupe des fiches vivantes et des hubs (faune, flore, etc.). Côté serveur, `sovereignApp.js` expose le comptage, l’aperçu et le détail des fiches, ainsi qu’un endpoint de conversion batch protégé. En production Vercel, le front appelle l’API selon l’origine configurée (`STRIPE_ALLOWED_ORIGINS`, `PUBLIC_SITE_URL`). En développement, le front (port 5173) et l’API (port 8787) sont des origines distinctes : la checklist CORS fait partie du déploiement sérieux.

### Encyclopédie et éditions Codex

L’encyclopédie PDF est un livrable **tangible** : téléchargement direct, chaîne reproductible (`assets/codex-encyclopedie/` → scripts d’assemblage → `public/encyclopedie.pdf`). Le companion documente chaque planche avec **sha256_fichier** pour vérifier l’intégrité. Les éditions web (investisseur, rituel, magique, alliance) permettent une lecture structurée sans télécharger le PDF. La section d’accueil `HomeEncyclopediasSection` met en avant ces entrées pour les nouveaux visiteurs.

### Paiements et soutien

Stripe est intégré (checkout session, payment intent, webhook signé). Aucun revenu n’est affirmé ici : le levier est **documenté et activable** après calibrage légal et prix pilote. Le modèle économique cible (take rate, forfait pilote, abonnement) est décrit dans `codex-investisseur.md` comme **cadre**, pas comme fait accompli.

### Mode pilote (UX récente)

Le **mode pilote** (`pilotScope.js`, `usePilotMode.js`) réduit la navigation aux routes essentielles : accueil, marketplace, publier, atlas, PDF, docs Codex, profil. Par défaut, `localStorage` active le pilote pour les nouveaux parcours. L’utilisateur peut élargir via « avancé » dans la navigation par pôles. C’est la traduction produit de la discipline « trois parcours, pas cent ».

### Modes simple et profond

Le **mode d’affichage** simple/profond (`displayMode`) simplifie les libellés de pôles et la densité d’information. Le mode profond expose les intitulés enrichis (« Échanger · circulation »). Cette dualité répond au risque « surface trop large » identifié dans le résumé investisseur.

### Recherche et onboarding

`GlobalSearchBar` indexe le graphe du site pour retrouver pages et sections. Les hints d’onboarding (`guidePageHints.js`) accompagnent les premières visites. Ces ajouts réduisent la friction sans prétendre à une base utilisateurs massive.

### Ce qui reste démo ou vision

Les portails cosmiques, l’underworld, les dashboards « paparazzi » ou « competitor intelligence » sont des **modules narratifs ou prototypes**. Ils prouvent la capacité d’itération UI et l’univers EGOR69 ; ils ne doivent pas être vendus comme modules SaaS matures sans développement dédié. Le `SymbolicDisclaimer` rappelle le caractère symbolique là où c’est pertinent.

---

## 3. Concepts — cadre intellectuel et opérationnel

### Économie circulaire

CirculAI part du constat que la circularité échoue souvent faute d’**exécution** : pas de boucle fermée entre publication, contact, réparation et preuve. Le produit vise à **tracer les flux**, réduire l’inutile et valoriser le réemploi — avec des indicateurs calibrables (`modeles-operationnels.md`), jamais des promesses d’impact CO₂ inventées pour la vitrine.

### Souveraineté

**Souveraineté** désigne ici le contrôle des données et des choix techniques : pas de contournement TLS, refus des métriques fictives, hébergement et dépôt documentés, consentement explicite pour toute extension de scope IA. Le serveur « souverain » (`createSovereignApp`) centralise les endpoints sensibles (Stripe, CRM, Atlas) plutôt que de disperser des secrets côté client.

### φ (phi) — proportion, pas dogme

φ ≈ 1,618 est utilisé comme **référence de design** (rythmes, proportions visuelles, seuils de travail dans les formules). Ce n’est pas une loi physique revendiquée. Le Codex Magique et l’Alliance IA rappellent : **modèles de travail à calibrer** sur données réelles.

### Alliance IA

L’**alliance IA** refuse la « super-IA » unique. Six rôles narratifs (Scribe, Gardien, Cartographe, Alchimiste, Médiateur, Chroniqueur) correspondent à des capacités réelles ou cibles du dépôt. L’orchestrateur route, journalise et fusionne ; l’humain valide tout acte irréversible (paiement, publication publique, push prod). Le protocole **OMÉGA** (Holo, Sym, Neg, Shapley, Circ) fournit un tableau de bord interne **Ω_op** — échelle indicative, non affichée comme vérité cosmique.

### Holon

Un **holon** est à la fois partie et tout : la plateforme se décompose en pôles (échanger, explorer, agir, jouer, univers) sans effacer les routes existantes. La navigation par pôles est une **vue** sur un graphe plus large (`navPoles.js`), pas une refonte destructive.

### Filtres Φ

Le filtre Φ = (A × V) / P (attention, valeur/vérité documentée, friction) est un **garde-fou éditorial** : bloquer cruauté gratuite, promesses médicales/financières non sourcées, contournements sécurité. En cas de conflit « positif vs vrai », la **vérité documentée prime**. Seuil indicatif de publication : Φ ≥ 1,2 — à calibrer en pilote.

### Modes simple et profond

Au-delà de l’UI, cette dualité structure la communication : **simple** pour partenaires institutionnels et smoke tests ; **profond** pour communauté, Codex et exploration narrative. Le mode pilote force le simple par défaut.

### EGOR69 vs CirculAI

**CirculAI** est la marque produit et programme. **EGOR69** est la persona / univers (Egor qui « baisse la manette », encyclopédie, formules). En contexte investisseur, privilégier CirculAI ; mentionner EGOR69 comme couche culturelle et IP documentée.

---

## 4. Solutions — architecture et chaînes techniques

### Front-end

- **Vite 6** + **React 18.3** + **React Router 6**
- **Tailwind CSS** + composants **Radix UI**
- **TanStack Query** pour le cache des données
- Client métier **base44** pour entités et fonctions (voir `ARCHITECTURE-ROUTES-API.md`)
- **Three.js** / **React Three Fiber** pour modules 3D
- **Leaflet** pour cartes
- **Framer Motion** pour animations
- **Sentry** pour erreurs front (si DSN configuré)

### Back-end (compagnon local / déploiement API)

- **Express** via `server/sovereignApp.js` (port 8787 en dev)
- **Stripe** : checkout, payment intent, webhook HMAC
- **CRM** : leads en NDJSON local
- **Atlas** : fiches vivantes, conversion scans
- **Helmet**, **CORS** configurables, pas d’affaiblissement TLS

### Hébergement

- **Vercel** : `framework: vite`, `installCommand: npm ci`, `buildCommand: npm run build`, `outputDirectory: dist`
- **Root Directory** : `peltiez` (obligatoire dans le monorepo)
- Rewrites SPA : toutes les routes non-API vers `index.html`
- URL de démo : **https://circulai-copy.vercel.app**

### Pipeline PDF

1. Planches sources : `assets/codex-encyclopedie/` (37 PNG)
2. Index + SHA256 : `scripts/generate_companion.cjs` → `docs/companion.md`
3. Assemblage : `npm run encyclopedie:assemble-full` (option texte `--with-text`)
4. Sortie publique : `public/encyclopedie.pdf`
5. Documentation : `codex-pdf-blueprint.md`, `codex-pdf-assembly.md`

### Preuves et reproductibilité

- Dépôt GitHub : historique commits, docs, scripts `verify` (lint, typecheck, build)
- Empreintes SHA256 par planche dans le companion
- Protocole **SCALE** : délégation IA, revue humaine, commits ciblés (`scale-protocol-v1.1.md`, fiche 1 page)
- **guardian.js** / `multiverse:guard` pour garde-fous dépôt

### Sécurité (principes)

- Secrets uniquement côté serveur / Vercel env
- Webhook Stripe vérifié
- Pas de `NODE_TLS_REJECT_UNAUTHORIZED=0`
- Disclaimers sur contenus symboliques, bien-être, rituel

---

## 5. Points forts

### Identité cohérente

CirculAI tient une ligne claire : circularité exécutable, francophonie québécoise, narration EGOR69 maîtrisée sans confusion de marque. Dominic Pelletier incarne le portage produit et documentaire.

### Ampleur fonctionnelle

Une seule codebase couvre marketplace, atlas, bien-être, jeux, 3D, docs, paiements — preuve de **capacité d’itération** et de vision long terme. Le mode pilote et les cinq pôles rendent cette ampleur **navigable**.

### Documentation exceptionnelle pour une phase pré-traction

Plus de quarante fichiers dans `peltiez/docs/` : investisseur, rituel, magique, alliance, preuves, architecture API, déploiement, QA manuel, canary, PHI design system. Peu de projets équivalents offrent un tel dossier **avant** levée.

### Livrables vérifiables

URL publique, PDF téléchargeable, SHA256 par asset, commits référencés (`4478e7d` SPA, infra `1da03d9`, proofs `7c473c7`). Un partenaire peut vérifier sans rendez-vous.

### UX récentes (2026)

- **Cinq pôles** : Échanger, Explorer, Agir, Jouer, Univers Egor69
- **Onboarding** et hints contextuels
- **GlobalSearchBar** sur le graphe site
- **HomeEncyclopediasSection** à l’accueil
- **Mode pilote** pour parcours restreint
- **PublishNextSteps** après publication
- **SymbolicDisclaimer** où requis

### Gouvernance SCALE

L’IA accélère la documentation et le code ; l’humain garde le go/no-go. Aligné avec les attentes de programmes publics ou fonds prudents.

### Risques assumés dans la doc

La documentation mentionne explicitement les risques (surface large, perception « cosmique », adoption) et les mitigations — signe de maturité rare.

---

## 6. Projections — pilote 90 jours et horizon 6–12 mois

### Pilote 90 jours (M0–M3)

**Objectif.** Valider un flux réel chez un partenaire (municipalité, ONG, PME, programme) avec trois KPI : temps, coût, qualité des données.

**Périmètre recommandé.**

- Une organisation, un inventaire ou un type d’annonce
- Trois parcours max : ex. publier → marketplace → contact ; ou atlas → fiche → export
- Revue hebdomadaire, artefacts Git à chaque sprint
- Mode pilote activé pour les utilisateurs terrain

**Livrables J90.**

- Rapport KPI avec données mesurées (pas extrapolées)
- Décision go / no-go / pivot
- Liste des intégrations manquantes (CRM, auth, stockage)

**Ce qui n’est pas promis en 90 jours.** Revenus récurrents, couverture nationale, conformité P691 affirmée sans document officiel, blockchain Merkle en production.

### 6–12 mois (prudent)

| Phase | Actions | Conditions de succès |
|-------|---------|----------------------|
| **M3–M6** | Durcir marketplace + hub réparation ; intégrations partenaires selon données pilote | KPI pilote au vert ou pivot documenté |
| **M6–M9** | Recalibrage modèle économique (take rate, forfait) sur métriques réelles | Au moins un flux monétisé ou subventionné documenté |
| **M9–M12** | Enrichissement encyclopédie PDF ; audit sécurité ciblé ; extension géographique si demande | Capacité ops (support, modération) identifiée |

### Contexte marché (prudent)

L’économie circulaire attire budgets publics et RSE, mais les acheteurs exigent des **preuves locales**. Le marché est fragmenté (places généralistes, programmes municipaux, ERP lourds). CirculAI ne revendique pas une part chiffrée : l’hypothèse est qu’un pilote bien cadré ouvre des suites **B2B déploiement**, **licence documentaire** ou **co-financement programme** — à démontrer, pas à projeter en millions.

---

## 7. Valeur — stratégique, reproductibilité, option pilote

### Valeur stratégique (qualitative)

CirculAI constitue un **actif de plateforme narrative et technique** : codebase modulaire, IP textuelle et visuelle (Codex, planches, formules), méthode SCALE reproductible, présence web déployée. Pour un partenaire institutionnel, la valeur est la **capacité à lancer un pilote documenté rapidement** avec des livrables publics (URL, PDF, dépôt) — réduction du risque « vaporware ».

### Coût de reproduction (ordre de grandeur méthodologique)

Sans inventer une valorisation en millions, on peut raisonner en **coût de reproduction** pour un tiers :

| Poste | Ordre de grandeur | Commentaire |
|-------|-------------------|-------------|
| Développement front + routes (centaines) | Plusieurs mois-équivalent dev senior | Réduit par génération IA + revue SCALE |
| Corpus documentaire FR | Semaines rédaction + relecture | Différenciateur fort |
| Pipeline PDF + 37 planches | Semaines design + scripts | SHA256 et companion inclus |
| Infra Vercel + Stripe + API | Jours configuration | Documenté dans proofs |
| Narration EGOR69 / Codex | Mois créatif | IP propre Dominic |

Un concurrent qui copierait uniquement le code sans le corpus et la gouvernance obtiendrait une **coquille vide**. La valeur réside autant dans **docs + méthode + marque** que dans le JavaScript.

### Propriété intellectuelle et documentation

Les textes Codex, les planches encyclopédie, les formules et la charte alliance sont **documentés et versionnés**. C’est un actif transmissible (licence, partenariat éditorial, programme culturel numérique).

### Option pilote

La « valeur » immédiate monétisable n’est pas un ARR fictif : c’est une **option sur pilote** — forfait 90 jours ou co-financement — dont le prix se fixe avec le partenaire selon périmètre (intégration CRM, modération, formation). Après J90, seules les métriques réelles justifient un abonnement ou un take rate.

### Ce que ce dossier ne fait pas

- Pas de valorisation « entreprise à X M$ »
- Pas de projections de revenus non sourcées
- Pas de promesse de conformité réglementaire non auditée

---

## 8. Annexes

### 8.1 Routes clés (SPA)

| Route | Description |
|-------|-------------|
| `/` | Accueil (encyclopédies, pôles) |
| `/marketplace` | Marketplace |
| `/publier` | Publication annonce |
| `/atlas` | Atlas vivant |
| `/encyclopedie.pdf` | PDF encyclopédie |
| `/docs/investisseur` | Codex investisseur |
| `/docs/rituel` | Codex rituel |
| `/docs/magique` | Codex magique |
| `/docs/alliance` | Alliance IA |
| `/carte-site` | Carte du site |
| `/hub-reparation` | Hub réparation |
| `/wellness` | Bien-être holistique |
| `/pricing` | Tarification |
| `/legal` | Mentions légales |
| `/profil` | Profil utilisateur |
| `/pantheon-3d` | Démo 3D |
| `/plateforme/temps-reel` | Métriques (démo contrôlée) |

### 8.2 URLs et dépôt

| Ressource | URL / chemin |
|-----------|----------------|
| **Site production** | https://circulai-copy.vercel.app |
| **Dépôt** | https://github.com/ChefPeltiex/la-finale |
| **PDF** | https://circulai-copy.vercel.app/encyclopedie.pdf |
| **Docs sources** | `peltiez/docs/` |
| **Companion** | `peltiez/docs/companion.md` |
| **Preuves** | `peltiez/docs/proofs.md` |
| **Final pack** | `peltiez/docs/final-pack.md` |

### 8.3 Commits et références utiles

| Commit | Sujet |
|--------|--------|
| `4478e7d` | fix(vercel): SPA routing / build production |
| `2b4b0ee` | docs: fiche SCALE 1 page |
| `7c473c7` | docs: dossier preuves CirculAI |
| `8415a5e` | docs: plan réseau, green-IT, diagrammes |
| `1da03d9` | docs: bundle infra Mermaid |

### 8.4 API Express (échantillon)

| Méthode | Route | Rôle |
|---------|-------|------|
| GET | `/api/health` | Santé |
| GET | `/api/platform/metrics-live` | Métriques live |
| GET | `/api/atlas/fiches-vivantes-count` | Comptage fiches |
| GET | `/api/atlas/fiches-vivantes-preview` | Aperçu |
| GET | `/api/atlas/fiche-vivante/:scanId` | Détail fiche |
| POST | `/api/atlas/convert-scans-to-live-sheets` | Conversion batch |
| POST | `/api/stripe/checkout` | Session checkout |
| POST | `/api/stripe/payment-intent` | Payment Intent |
| POST | `/api/stripe/webhook` | Webhook Stripe |
| POST | `/api/crm/lead` | Lead CRM |

### 8.5 Table des 22 formules (une ligne chacune)

| # | Formule | Une ligne opératoire |
|---|---------|----------------------|
| 1 | Abra Ca Da Bra | Seuil d’ouverture : intention ÷ résistance avant décision lourde |
| 2 | Am Stram Gram | Choix équitable : tirage ou priorité publiée et traçable |
| 3 | Pic et Pic et Colégram | Deux positions puis mot de clôture pour apaiser un conflit |
| 4 | Cœur Pur | Intégrité : amour × vérité ÷ peur — base alliance IA |
| 5 | Infini | Continuité disciplinée avec jalons, pas excuse d’inachevé |
| 6 | Chaos Pur | Brainstorm fertile puis stabilisation |
| 7 | Anima Mundi | Mémoire du vécu : « où suis-je dans la boucle ? » |
| 8 | Nexus Omnibus | Cartographie des liens sans centre tyrannique |
| 9 | Solve et Coagula | Dissoudre silos, refaire du lien réemployable |
| 10 | Tempus Meum | Le temps sert : timeboxing et clôture |
| 11 | Ex Nihilo Omnia | Petites genèses itératives (MVP) |
| 12 | Ad Infinitum (φ) | Fractal et harmonie visuelle (φ) |
| 13 | Clavis Arcani | Divulgation graduée, pas tout d’un coup |
| 14 | Lux Perpetua | Paix = lumière sur l’ombre, pas déni |
| 15 | Omega Synthesis | Synthèse de fin qui ouvre la suite |
| 16 | Alliance IA | Six agents autour d’un orchestrateur journalisé |
| 17 | Pont humain–machine | Traduction explicite entre humain et outil |
| 18 | Cerveau collectif | Mémoire partagée avec consentement (Git, SCALE) |
| 19 | Économie circulaire ΔM | Variation de « masse » utile échangée dans le pilote |
| 20 | Loi \|x\| | Intensité émotionnelle sans perdre le signe de l’action juste |
| 21 | Mémoire du futur | Scénarios amont pour ne pas casser l’éthique |
| 22 | Respiration × φ | Rythme rétabli après effort ou alerte |

*Détail des démarches : `peltiez/docs/codex-magique-egor69.md`.*

### 8.6 Modèles opérationnels (rappel)

| Modèle | Formule résumée |
|--------|-----------------|
| Circulation | Impact_local = (objets_réutilisés × facteur_CO₂) / population_zone |
| Confiance | (transactions_validées + avis) / (signalements + 1) |
| Engagement | pages_atlas × profondeur / temps_session |
| Souveraineté | données_conformes / données_totales |
| Régénération | (dons + réparations) / (ventes_neuves_proxy + 1) |
| Équilibre pôles | visites_pôle / Σ visites |

---

## 9. Annexe technique

### 9.1 Stack récapitulative

| Couche | Technologies |
|--------|----------------|
| UI | React 18.3, Vite 6, Tailwind, Radix, Framer Motion |
| Routing | React Router 6 |
| Data | TanStack Query, base44 client |
| API | Node.js, Express (`sovereignApp.js`) |
| Paiements | Stripe (server + `@stripe/stripe-js`) |
| 3D | Three.js, @react-three/fiber, drei |
| Cartes | Leaflet, react-leaflet |
| PDF | pdfkit (scripts), assemblage PNG |
| Qualité | ESLint 9, TypeScript (jsconfig), Playwright e2e |
| Observabilité | Sentry (optionnel) |
| Email | Resend (si configuré) |
| Deploy | Vercel (front), API selon hébergement choisi |

### 9.2 Scripts npm utiles

| Script | Usage |
|--------|--------|
| `npm ci` | Install reproductible (Vercel + local) |
| `npm run dev` | Front Vite |
| `npm run dev:api` | API Express |
| `npm run dev:stack` | Front + API concurrent |
| `npm run build` | Build production |
| `npm run verify` | lint + typecheck + build |
| `npm run verify:deep` | + audit + guardian |
| `npm run encyclopedie:assemble-full` | PDF encyclopédie |
| `npm run docs:assemble-codex-pdf` | Autres PDF Codex |
| `npm run test:e2e` | Playwright |

### 9.3 Checklist déploiement (racine `peltiez`)

1. Cloner `la-finale`, entrer dans `peltiez/`
2. `npm ci`
3. Variables d’environnement (voir `GITHUB_SECRETS_TEMPLATE.md`) : Stripe, origines CORS, URL publique
4. `npm run verify` en local
5. Vercel : **Root Directory = `peltiez`**
6. `installCommand`: `npm ci` · `buildCommand`: `npm run build` · `outputDirectory`: `dist`
7. Vérifier smoke : `curl -I https://circulai-copy.vercel.app/` et `/marketplace`
8. Télécharger `/encyclopedie.pdf` (fichier volumineux)
9. API : déployer `server/` ou fonctions selon architecture cible ; aligner `STRIPE_ALLOWED_ORIGINS`

### 9.4 Structure monorepo

```
la-finale/
  peltiez/          ← application CirculAI (Vercel root)
    src/            ← React
    server/         ← Express sovereign app
    public/         ← assets statiques + encyclopedie.pdf
    docs/           ← corpus documentaire
    scripts/        ← PDF, companion, garde-fous
  assets/           ← planches codex-encyclopedie (repo parent)
```

### 9.5 Génération de ce dossier

- Source Markdown : `peltiez/docs/EGOR69-CirculAI-Dossier-Plateforme.md`
- Word : `node scripts/generate-platform-dossier-docx.mjs` (package `docx`)

---

**Contact lecture** : Dominic Pelletier · CirculAI · [circulai-copy.vercel.app](https://circulai-copy.vercel.app)

*CirculAI — la circularité en livrables, pas en slides.*
