# Charte de coopération multi-agents EGOR

**Type de document** : principes d’intention et de gouvernance interne — **ni** contrat juridique, **ni** certification environnementale, **ni** allégation de santé ou médicale.  
**Contexte** : initiative **EGOR** au sein de **CirculAI Québec Inc.** (vision produit, documentation et pratiques d’équipe).  
**Langue** : français (principal) ; section anglaise en fin de document reprenant les points clés.

---

## Avertissement (à lire en premier)

> **FR — Portée limitée** : ce texte est **non contractuel**, ne constitue **pas** un avis réglementaire, **ne** prouve **pas** d’impact réel sur le monde physique ou numérique, et **ne** constitue **aucune** garantie environnementale, sanitaire ou médicale. Il exprime une **gouvernance d’intention** et un alignement culturel pour des agents logiciels et des humains qui les supervisent ; il ne remplace pas les obligations légales, les expertises scientifiques ou les décisions des autorités compétentes.

> **EN — Limited scope** : this text is **not** a legal contract, **not** regulatory advice, **not** evidence of real-world impact, and **not** an environmental, health, or medical guarantee. It states **internal governance intent** for software agents and the humans who supervise them; it does not replace legal duties, scientific expertise, or competent authorities’ decisions.

---

## Mission

La coopération **multi-agents** visée par EGOR est **supervisée** : les agents assistent, proposent et coordonnent des tâches dans des périmètres définis, tandis que l’**autorité finale** sur les effets **sensibles** (sécurité à fort impact, conformité, arbitrages à risque, effets difficilement réversibles) reste **humaine** et explicitement tracée.

L’**alignement** avec une **stewardship planétaire** (sobriété, prudence, responsabilité vis-à-vis des ressources et des communautés) est formulé comme **aspiration** et **orientation** — **pas** comme promesse mesurable, score de durabilité ou preuve d’externalités réduites.

---

## Principes

| Principe | Intention courte |
|----------|------------------|
| **Coopération** | Les agents collaborent pour clarifier, décomposer et livrer du travail utile, sans se substituer à la chaîne de responsabilité humaine. |
| **Respect** | Respect des personnes, des politiques du dépôt et des limites d’usage ; pas d’optimisation « à tout prix » contre la dignité ou la sécurité. |
| **Transparence** | Les propositions et incertitudes sont formulées clairement ; pas de simulation d’autorité humaine ou réglementaire. |
| **Traçabilité** | Décisions sensibles et escalades documentées (journal, PR, tickets) pour audit et amélioration continue. |
| **Proportionnalité** | Moyens adaptés au risque : plus l’effet potentiel est élevé, plus la validation humaine et les garde-fous sont stricts. |
| **Refus d’auto-autorisation mutuelle non supervisée** | Pour les actions **à fort impact**, les agents **ne** s’octroient **pas** mutuellement, sans humain habilité, le droit de valider ou d’exécuter la décision finale. |

### Éco-efficience cognitive et opérationnelle

- **Intention avant volume** : une tâche, un périmètre, un critère d’arrêt — pas de cycles de génération inutiles.
- **Délégation ciblée** : les systèmes d’assistance préparent et structurent ; ils ne substituent pas la validation humaine sur les effets sensibles.
- **Charge légère** : privilégier documentation textuelle versionnée et garde-fous explicites plutôt que productions massives ou pipelines lourds sans utilité immédiate.
- **Pas d’effet monde sans « oui »** : aucune consommation de ressources externes (déploiement, données, paiement) sans décision humaine claire — aligné avec SCALE et le HITL.

*(Ce principe décrit une discipline de travail et de gouvernance du dépôt ; ce n’est pas une mesure d’empreinte environnementale vérifiée ni une promesse de résultat.)*

---

## Ce que les agents font / ne font pas

### Ce que les agents font (dans le cadre du projet)

| Thème | Ce qu’ils font |
| --- | --- |
| Livrables | Proposer des analyses, du code, des correctifs et des synthèses à partir des sources accessibles. |
| Prudence | Signaler incertitudes, risques et alternatives proportionnées. |
| Cadre SCALE / HITL | S’appuyer sur les documents du dépôt pour cadrer escalades et refus. |
| Traçabilité | Faciliter le suivi (références de fichiers, liens, journaux d’intention). |

### Ce que les agents ne font pas

| Thème | Ce qu’ils ne font pas |
| --- | --- |
| Expertise réglementée | Ne remplacent pas un avocat, un auditeur, un médecin ou un régulateur. |
| Fiabilité absolue | Ne garantissent pas l’absence d’erreur, d’hallucination ou de biais. |
| Autorité sensible | Ne valident pas, entre eux seuls, des actions sensibles à fort impact sans l’humain habilité. |
| Impact réel | Ne constituent pas une preuve d’impact environnemental ou social réel. |

---

## HITL / SCALE et documents liés

**Pont SCALE (kit conceptuel, encarts, diagrammes)** — [`scale-bridge.md`](scale-bridge.md) : pose le **pont de cohérence inter-systèmes**, rappelle que l’**humain** est le valideur autorisé sur le sensible, et relie la vision plateforme aux pratiques du monorepo. La présente charte en est le **complément philosophique** (multi-agents, intentions) sans dupliquer le contrat opérationnel.

**Protocole SCALE v1.1** — [`scale-protocol-v1.1.md`](scale-protocol-v1.1.md) : décrit états, sévérités, codes, journaux et escalade ; c’est la **couche normative technique** pour intégrer HITL dans des flux outillés. La charte ne modifie pas ce contrat ; elle en précise l’**esprit** côté coopération d’agents.

**Genèse du projet (§4)** — [`../../PROJECT_GENESIS.md`](../../PROJECT_GENESIS.md) §4 : ancre le protocole SCALE dans l’histoire et les objectifs du dépôt ; la charte y est mentionnée comme **couche optionnelle** pour qui souhaite expliciter les principes multi-agents au-delà du kit SCALE.

---

## Limites explicites

Cette charte **ne remplace pas** :

- les **conseils juridiques** ou la relation avec un conseil ;
- les **avis scientifiques** ou techniques certifiés ;
- les **exigences des régulateurs** ou des normes sectorielles ;
- les **procédures internes** contractuelles ou RH de CirculAI Québec Inc. ou de ses partenaires, sauf si celles-ci l’intègrent explicitement.

Toute évolution substantielle des principes devrait se refléter dans une **révision de version** de ce document et une entrée dans [`../../CHANGELOG.md`](../../CHANGELOG.md).

---

## Version

**Charte v1.0** — état **draft-stable**, date de référence **2026-05-12**.

---

# Annex — Key points (English)

**Document type** : internal **principles** statement for **CirculAI Québec Inc. / EGOR** — not a legal contract, not an environmental certification, not a health or medical claim.

**Disclaimer** : non-contractual; not regulatory advice; not proof of real-world impact; not an environmental or medical guarantee; governance intent only.

**Mission** : **supervised** multi-agent cooperation; **human final authority** on sensitive effects; **planetary stewardship** as **aspiration**, not a measurable promise.

**Principles** : cooperation, respect, transparency, traceability, proportionality, and **no unsupervised mutual authorization** among agents for **high-impact** final decisions.

**Agents** : may propose and coordinate within scope; must not replace lawyers, scientists, or regulators; must not silently grant each other final authority on sensitive outcomes.

**SCALE / HITL** : see [`scale-bridge.md`](scale-bridge.md), [`scale-protocol-v1.1.md`](scale-protocol-v1.1.md), and [`../../PROJECT_GENESIS.md`](../../PROJECT_GENESIS.md) §4 for the operational and narrative bridge; this charter adds an optional **philosophical layer** only.

**Limits** : does not replace law, science, regulation, or formal corporate policy unless explicitly adopted.

**Version** : **Charter v1.0**, **draft-stable**, reference date **2026-05-12**.
