# Bus d’intégration — JSON (et GraphQL plus tard)

## Objectif

Standardiser les échanges entre **Egor69** (couche web / API Node) et des **organes externes** (CRM, facturation, IA spécialisées, entrepôts) sans promettre de connecteurs déjà codés pour chaque éditeur.

## Format recommandé (REST + JSON)

- **Requêtes** : `Content-Type: application/json`, schémas validés (ex. **Zod** côté `server/`).
- **Réponses** : enveloppe `{ ok, data?, error?, requestId? }` pour homogénéiser les erreurs.
- **Idempotence** : en-tête `x-idempotency-key` pour les mutations (déjà utilisé sur Stripe checkout).

## Exemple minimal (pseudo-contrat)

```json
{
  "event": "order.created",
  "version": "1",
  "occurred_at": "2026-05-12T12:00:00Z",
  "payload": {
    "order_id": "ord_123",
    "currency": "CAD",
    "lines": [{ "sku": "SKU-1", "qty": 1 }]
  }
}
```

## GraphQL (option)

Utile quand plusieurs clients consomment le même graphe métier. Prévoir **auth** forte et **limites de profondeur** pour éviter les abus.

## Publicité & tracking

Aucune bannière publicitaire dans le bundle ; les connecteurs métiers ne doivent pas réintroduire de **pixels trackers** sans consentement explicite et mention légale.
