# Security policy

## Portée

Ce dépôt contient notamment l’application **IGOR** (`peltiez/`) : frontend (Vite/React), API Node (Express) et scripts associés. Les signalements concernent de préférence une **exécution déloyale** (injection, contournement d’auth, fuite de données, etc.) et non des simples bugs fonctionnels (voir Issues).

## Versions prises en charge

| Branche / contexte | Support sécurité |
|---------------------|------------------|
| `master` / `main` (dernier état poussé) | Oui — signalements analysés |
| Autres branches / forks | Au cas par cas |

Les correctifs sont appliqués sur la branche principale ; pense à **mettre à jour** ton déploiement après publication d’un correctif.

## Autorité humaine (protocole SCALE)

Les **outils** (IA, IDE, CI) assistent et automatisent dans un **périmètre défini** ; ils ne remplacent pas la **décision humaine** sur :

- la **priorisation** et le **merge** de correctifs sensibles,
- les **exceptions** de politique ou les changements qui élargissent la surface d’attaque,
- la **divulgation** coordonnée après analyse d’un rapport.

Aligné avec la **règle d’or** documentée dans [`PROJECT_GENESIS.md`](PROJECT_GENESIS.md) §4 et le kit [`peltiez/docs/scale-bridge.md`](peltiez/docs/scale-bridge.md) : *l’humain est le valideur autorisé sur le sensible* — ce qui limite dérive, exécutions non voulues et erreurs irréversibles.

## Signaler une vulnérabilité

**Méthode préférée (privée)** : ouvrir un avis de sécurité GitHub sur ce dépôt :

1. Aller sur **[Security → Report a vulnerability](https://github.com/ChefPeltiex/la-finale/security/advisories/new)** (ou onglet *Security* du dépôt, puis *Private vulnerability reporting* si activé par les propriétaires du repo).

2. Décrire : impact, étapes de reproduction minimales, composant concerné (`peltiez/server`, front, etc.), version / commit si possible — **sans** joindre d’exploitation destructive.

**Délai de réponse visé** : prise en compte sous **~7 jours ouvrés** pour un premier retour (selon charge). Les correctifs critiques sont priorisés.

**Ne pas** ouvrir une Issue publique pour une vulnérabilité exploitable avant qu’un correctif ou un plan de mitigation soit communiqué.

## Divulgation

Après correction, la publication peut passer par un **GitHub Security Advisory** (crédit optionnel au rapporteur) et une entrée dans [`CHANGELOG.md`](CHANGELOG.md) sous une section *Security*.

## Hall of fame

Non obligatoire ; peut être ajouté plus tard si CirculAI Québec Inc. souhaite remercier publiquement les rapporteurs.

---

Copyright © 2026 CirculAI Québec Inc.
