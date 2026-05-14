# Diagrammes d’architecture (sources Mermaid)

Ce dossier regroupe des **schémas source** réutilisables dans la documentation (GitHub, wiki, exports SVG/PNG via outils Mermaid). Les blocs ci-dessous sont **copier-coller** dans tout éditeur compatible Mermaid.

## Contenu attendu (hors README)

- Schémas **landing zone** (abonnements, réseau, identité, journalisation) — voir `landing-zone-notes.md`
- Diagrammes exportés (PNG/SVG) depuis Miro, draw.io ou équivalent si vous versionnez des exports
- Alignement des CIDR sur `peltiez/docs/network-ip-plan.md` ; toute divergence doit être tracée (PR ou légende du schéma)

## Bonnes pratiques

- Nommer les exports par sujet et date (`landing-zone-2026-05.png`) pour la traçabilité présentation / audit
- Ne pas y placer de **secrets** (clés, jetons) : uniquement flux et agrégats CIDR anonymisés ou gabarits

---

## Contexte CirculAI / déploiement actuel

Le dépôt applicatif vit sous la racine **`peltiez`** : intégration **GitHub** (CI), hébergement **Vercel** pour la SPA et les routes associées. Point d’ancrage Git pour la stratégie de réécriture SPA : commit **`4478e7d`**.

---

## 1. Infrastructure cible (vue logique)

```mermaid
flowchart TB
  subgraph Edge["Edge"]
    CDN[CDN]
    LB[Load Balancer]
  end
  subgraph Presentation["Présentation"]
    SPA[SPA / front statique]
  end
  subgraph Gateway["API"]
    APIGW[API Gateway]
  end
  subgraph Services["Microservices"]
    MS1[Service A]
    MS2[Service B]
    MS3[Service …]
  end
  subgraph Data["Données"]
    DB[(Base relationnelle / NoSQL)]
    OBJ[Stockage objet]
  end
  subgraph Platform["Plateforme"]
    CICD[CI/CD GitHub Actions]
    OBS[Observabilité traces/métriques/logs]
    SEC[Secrets / WAF / IAM]
  end
  Users((Utilisateurs)) --> CDN --> LB --> SPA
  Users --> CDN --> LB --> APIGW
  APIGW --> MS1
  APIGW --> MS2
  APIGW --> MS3
  MS1 --> DB
  MS2 --> DB
  MS3 --> DB
  MS1 --> OBJ
  MS2 --> OBJ
  MS3 --> OBJ
  CICD -.-> SPA
  CICD -.-> APIGW
  CICD -.-> MS1
  OBS -.-> MS1
  OBS -.-> APIGW
  SEC -.-> APIGW
  SEC -.-> MS1
```

---

## 2. Couches de déploiement (edge → intégration)

```mermaid
flowchart LR
  subgraph L1["Edge"]
    E1[CDN / WAF / TLS]
  end
  subgraph L2["Présentation"]
    E2[SPA / BFF]
  end
  subgraph L3["Application"]
    E3[Domain services / files]
  end
  subgraph L4["Données"]
    E4[BD / cache / objet]
  end
  subgraph L5["Intégration"]
    E5[Files d’attente / webhooks / partenaires]
  end
  E1 --> E2 --> E3 --> E4
  E3 <--> E5
```

---

## 3. Landing zone (composants types)

```mermaid
flowchart TB
  subgraph Accounts["Comptes / abonnements"]
    M[Management]
    S[Shared services]
    W[Workloads]
  end
  subgraph Network["Réseau baseline"]
    VPC[VPC / hub]
    FW[Pare-feu / inspection]
  end
  subgraph Identity["Identité"]
    IAM[IAM / SSO]
    RBAC[RBAC / JIT]
  end
  subgraph Security["Sécurité"]
    KMS[KMS / secrets]
    LOG[Journalisation centralisée]
  end
  subgraph Platform["Plateforme"]
    REG[Registre conteneurs]
    OBS2[Observabilité]
  end
  subgraph Guardrails["Guardrails"]
    POL[Policies as code]
    SCP[Contrôles organisationnels]
  end
  M --> S
  M --> W
  S --> VPC
  S --> IAM
  S --> KMS
  W --> VPC
  VPC --> FW
  IAM --> RBAC
  POL -.-> W
  POL -.-> S
  SCP -.-> W
  SCP -.-> S
  REG -.-> W
  OBS2 -.-> W
  LOG -.-> W
  LOG -.-> S
```

---

## 4. Flux de données (traçabilité et vie privée)

```mermaid
flowchart LR
  subgraph Sources["Sources"]
    S1[Applications]
    S2[Partenaires]
    S3[Capteurs / fichiers]
  end
  subgraph Ingestion["Ingestion"]
    I1[API / batch / streaming]
  end
  subgraph Processing["Traitement"]
    P1[Validation / enrichissement]
    P2[Anonymisation / pseudonymisation]
  end
  subgraph Storage["Stockage"]
    ST1[Lacs / entrepôts]
    ST2[Bases opérationnelles]
  end
  subgraph Consumption["Consommation"]
    C1[BI / API / ML]
  end
  subgraph Trace["Traçabilité"]
    T1[Lignée données / catalogage]
  end
  subgraph Privacy["Confidentialité"]
    PR1[Consentements / minimisation]
  end
  S1 --> I1
  S2 --> I1
  S3 --> I1
  I1 --> P1 --> P2
  P2 --> ST1
  P2 --> ST2
  ST1 --> C1
  ST2 --> C1
  P1 -.-> T1
  P2 -.-> T1
  ST1 -.-> T1
  P2 -.-> PR1
  C1 -.-> PR1
```

---

## Fichiers complémentaires

- **`landing-zone-notes.md`** : pistes de modules IaC et dépendances (sans fichier `.tf` factice).
