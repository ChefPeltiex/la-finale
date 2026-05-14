# Notes — landing zone (gabarit)

Document **gabarit** en français : à adapter au cloud cible (Azure/AWS/GCP) et au modèle d’entreprise (hub-and-spoke, landing zone modulaire, politiques centralisées).

---

## 1. Objectifs d’une landing zone

- **Séparation des environnements** : production, staging, développement — cohérent avec les blocs CIDR de `peltiez/docs/network-ip-plan.md`
- **Identité et accès** : rôles least-privilege, comptes de service dédiés aux pipelines, MFA pour l’administration
- **Observabilité** : journaux centralisés, rétention documentée, corrélation avec les changements IaC
- **Conformité** : chiffrement au repos et en transit par défaut, classification des données, DLP selon politique client

---

## 2. Couches logiques (schéma type)

| Couche | Rôle | Rappel réseau |
|--------|------|---------------|
| **Edge** | CDN, WAF, terminaison TLS publique | Trafic entrant filtré avant le VPC/VNet |
| **Exposition** | API gateway, reverse proxy, load balancers | Sous-réseaux « web » du plan IP |
| **Application** | services métier, workers, files d’attente | Sous-réseaux « app », souvent privés |
| **Données** | bases managées, caches, stockage objet privé | Sous-réseaux « db », sans route Internet directe |

---

## 3. Hub vs spoke (optionnel)

- **Hub** : connectivité partagée (firewall, inspection, DNS interne, bastion contrôlé)
- **Spokes** : workloads par produit ou par environnement, peerés au hub
- **Attention** : documenter les plages RFC1918 pour éviter tout chevauchement avec VPN site-à-site ou réseaux existants

---

## 4. Checklist avant diagramme final

- [ ] Régions et zones de disponibilité choisies et nommées sur le schéma
- [ ] Flux nord-sud (Internet → app) et est-ouest (inter-VPC / PrivateLink) distingués
- [ ] Points d’intégration CI/CD (runners, registre d’images, secrets) sans exposition de valeurs sensibles
- [ ] Légende : public / privé / données chiffrées / périmètre de confiance

---

## 5. Prochaine étape

Exporter un **PNG ou SVG** dans ce dossier (`diagrams/`) une fois le modèle validé avec l’équipe réseau / sécurité, et référencer le fichier depuis `peltiez/docs/proofs.md` ou la fiche SCALE si besoin.
