# Checklist « guide vert / TI durable » (référence P691)

« Référence P691 : à confirmer selon le document officiel du client ; cette checklist regroupe pratiques courantes d’écoconception et d’exploitation responsable. »

Objectif : **cadrage actionnable** pour réduire l’empreinte énergétique et matérielle des systèmes, sans substituer une norme contractuelle non validée.

---

## Calcul (compute)

- [ ] Dimensionnement à la demande (auto-scaling) avec plafonds documentés
- [ ] Arrêt ou mise en veille des environnements non productifs hors heures ouvrées
- [ ] Choix d’instances / SKU « droit à la taille » (éviter sur-provisionnement permanent)
- [ ] Conteneurs : images minimales, une seule couche d’OS par cluster quand pertinent
- [ ] Politique de réutilisation des runners CI (mise en cache des dépendances)

---

## Stockage

- [ ] Politique de cycle de vie (tiers froid / archivage) pour journaux et médias
- [ ] Déduplication ou compression là où le gain est mesuré
- [ ] Suppression des données obsolètes (rétention alignée sur la conformité)
- [ ] Volumes provisionnés revus trimestriellement (éviter disques « au cas où »)

---

## CI / CD

- [ ] Pipelines déclenchés uniquement sur les branches / chemins pertinents
- [ ] Tests parallèles bornés (limiter les matrices inutiles)
- [ ] Artefacts conservés le temps strictement nécessaire
- [ ] Mise en cache des builds (langage, dépendances) mesurée et surveillée

---

## Données

- [ ] Minimisation : collecter uniquement les champs utiles au service
- [ ] Proximité géographique stockage ↔ traitement pour limiter transferts
- [ ] Requêtes et index revus (éviter scans complets récurrents)
- [ ] Flux batch de nuit ou heures creuses quand l’électricité est moins carbonée (si politique locale)

---

## Transparence

- [ ] Tableau de bord partagé : coût, volumétrie stockage, durée moyenne de pipeline
- [ ] Indicateurs « carbone » ou proxy (CPU-heures, egress) si disponibles chez le fournisseur
- [ ] Documentation des choix d’architecture impactant l’empreinte (CDN, edge, région)

---

## Audit

- [ ] Revue semestrielle des ressources orphelines (IP, disques, snapshots)
- [ ] Traçabilité des changements d’infra (IaC, tickets) pour corréler pics de consommation
- [ ] Plan d’amélioration continue avec priorités chiffrées (quick wins vs investissements)
