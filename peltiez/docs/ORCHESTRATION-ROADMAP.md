# Roadmap — orchestration Egor69 (vision vs livré)

Ce document structure la **vision** (hub d’orchestration, IA multiples, SaaS métiers) par rapport au **code présent** dans le dépôt `peltiez`.

## Déjà présent (réel)

- SPA React + routes documentées, **carte du site** (`/carte-site`) alimentée par `src/data/siteGraph.js`.
- **Liens contextuels** (layout) à partir des mêmes données.
- **Glossaire central** (`src/data/glossaryCentral.js`).
- **API** Express : santé, Stripe, CRM lead, Atlas — voir `server/sovereignApp.js`.
- **Docs** : Unreal (`docs/unreal-bridge.md`), intégrations (`docs/INTEGRATIONS-SECURITE-ENTREPRISE.md`), échantillon JSON univers (`public/ue-aiouy/universe-config.sample.json`).

## Vision — passerelles IA (à brancher)

| Besoin | Exemple de fournisseur | Intégration typique |
|--------|-------------------------|---------------------|
| Résumé juridique | API spécialisée + avocat validateur | Backend + consentement + journalisation |
| Analyse financière | Outil comptable externe | Export CSV / API partenaire, pas de « magie » sans révision humaine |
| Merch / reco | Moteur reco e-commerce | Webhooks + catalogue produit |
| Logistique | TMS / WMS | Événements JSON sur bus — voir `BUS-INTEGRATION.md` |

## Vision — modules « entreprise » (hors bundle actuel)

Les blocs suivants relèvent d’**ERP / suites métiers** ou de développements sur mesure : compta complète, paie, chaîne d’approvisionnement bout-en-bout, dossiers ministériels sensibles, etc. Egor69 peut en être la **coquille d’accès** (auth, navigation, liens) mais **pas** le remplacement entier de ces systèmes sans projet dédié.

## Vision — secteur public

Traçabilité décisionnelle, gestion des dossiers, classification : **exigences légales** propres à chaque administration. Toute évolution doit passer par architecture d’information + juristes + hébergeur qualifié.

## Historique « universel » par page

- **Code & contenus** : Git (commits, PR, blame).
- **Contenus éditoriaux** : forge Git ou CMS si vous en ajoutez un.
- **Historique métier par utilisateur** : nécessite base de données et politiques de conservation — non inclus dans la SPA seule.

## Écoresponsabilité & IA générative

Prioriser : **caching**, **résolutions modérées**, **fournisseurs** publiant une politique carbone, **pas** de boucles de génération en continu côté client. Voir `/outils-integration`.
