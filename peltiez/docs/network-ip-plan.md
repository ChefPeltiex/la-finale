# Plan d’adressage IP (modèle multi-environnements)

Document **gabarit** : à adapter au fournisseur cloud réel (régions, contraintes RFC1918, chevauchements avec réseaux existants, réservations d’opérateur).

---

## 1. Agrégats CIDR par environnement

| Environnement | Bloc CIDR principal | Rôle |
|-----------------|---------------------|------|
| **Production** | `10.0.0.0/16` | Charge de travail critique, trafic utilisateur final |
| **Staging** | `10.1.0.0/16` | Préproduction, tests d’intégration proches du réel |
| **Développement** | `10.2.0.0/16` | Expérimentation, pipelines de dev, bacs à sable |

Chaque `/16` laisse de la marge pour segmenter en `/24` (jusqu’à 256 sous-réseaux logiques par environnement, selon besoin réel).

---

## 2. Exemples de sous-réseaux `/24` (à caler sur vos AZ)

Libellés indicatifs : **web** (couche exposition / reverse proxy), **app** (services applicatifs), **db** (bases et caches sensibles).

### Production (`10.0.0.0/16`)

| Sous-réseau | CIDR exemple | Usage typique |
|-------------|--------------|---------------|
| `prod-web-az-a` | `10.0.1.0/24` | Instances ou endpoints « edge » internes, DMZ applicative |
| `prod-app-az-a` | `10.0.2.0/24` | Conteneurs / workers applicatifs |
| `prod-db-az-a` | `10.0.3.0/24` | RDS, cluster managé, réplicas lecture |
| *(répéter par AZ)* | `10.0.11.0/24`, … | Miroiter web/app/db sur `az-b`, `az-c` avec incrément d’octet contrôlé |

### Staging (`10.1.0.0/16`)

| Sous-réseau | CIDR exemple | Usage typique |
|-------------|--------------|---------------|
| `stg-web` | `10.1.1.0/24` | Front staging, tests de routage |
| `stg-app` | `10.1.2.0/24` | Services et files d’attente de préprod |
| `stg-db` | `10.1.3.0/24` | Bases anonymisées ou jeux de données réduits |

### Développement (`10.2.0.0/16`)

| Sous-réseau | CIDR exemple | Usage typique |
|-------------|--------------|---------------|
| `dev-web` | `10.2.1.0/24` | Bancs de test UI / API mock |
| `dev-app` | `10.2.2.0/24` | Microservices en itération rapide |
| `dev-db` | `10.2.3.0/24` | Instances locales managées ou conteneurs persistants |

**Bonnes pratiques** : réserver des plages « infrastructure » (endpoints privés API cloud, bastions, observabilité) dans des `/24` dédiés pour éviter la fragmentation ad hoc.

---

## 3. Sous-réseaux publics vs privés

| Type | Attachement route par défaut | Cas d’usage |
|------|------------------------------|-------------|
| **Public** | Passerelle Internet (IGW équivalent) | NAT (sortie), bastions très contrôlés, endpoints explicitement publics derrière pare-feu |
| **Privé** | NAT ou aucune route Internet | Applications, bases, files d’attente — **cœur de la surface d’attaque réduite** |

Règle d’orientation : **tout ce qui n’a pas besoin d’une IP Internet ne doit pas vivre dans un sous-réseau public**.

---

## 4. NAT vs passerelle Internet (IGW)

| Mécanisme | Sens du trafic | Rôle |
|-----------|----------------|------|
| **IGW** | Entrant/sortant depuis/vers Internet pour ressources avec adresse publique | Point d’entrée Internet du VPC (souvent unique par VPC) |
| **NAT (gateway ou instance)** | Sortie **uniquement** depuis sous-réseaux privés vers Internet | Mises à jour, appels API externes, sans exposer d’IP privée en entrée |

**Règles pratiques**

- Les charges applicatives et bases restent en **privé** ; la sortie Internet passe par **NAT** si nécessaire.
- L’**IGW** sert surtout aux sous-réseaux publics (LB publics, bastion, NAT lui-même selon modèle).
- Éviter les « doubles NAT » involontaires et documenter les exceptions (proxy sortant, PrivateLink, etc.).

---

## 5. Emplacements VPN / peering (à compléter)

| Intégration | Statut | Notes |
|-------------|--------|-------|
| **Site-to-site VPN** | *À définir* | CIDR distants à exclure des plans ci-dessus (anti-chevauchement) |
| **Transit / hub-and-spoke** | *Optionnel* | Centraliser inspection et routage inter-VPC |
| **Peering VPC / VNet** | *Optionnel* | Latence faible ; attention au maillage et aux quotas |
| **PrivateLink / Private Service Connect** | *Recommandé* | Remplacer l’exposition Internet pour les SaaS compatibles |

---

## 6. Personnalisation cloud

Ce plan est un **modèle de présentation** : recaler chaque ligne sur les **AZ réelles**, les **quotas**, les **politiques de sécurité** du client et les **plages déjà utilisées** sur site. Valider avec l’équipe réseau avant toute implémentation Terraform / ARM / CloudFormation.
