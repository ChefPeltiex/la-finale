# Intégrations, sécurité, entreprise — cadre réel (Peltiez / Egor69)

Ce document **ancre la communication** sur ce que le dépôt fait aujourd’hui, ce qui relève d’**intégrations externes** (autres sites / logiciels / IA), et ce qui **n’est pas** promis.

## Référencement et publicité

- **Pas de réseau publicitaire tiers** dans le bundle : pas de slots AdSense ou équivalent dans le code livré.
- Le **référencement** passe par contenu, `sitemap.xml`, métadonnées, pages structurées — pas par de la pub achetée côté app.
- Les **liens sortants** vers outils d’IA ou moteurs créatifs sont des **choix utilisateur** : lisez leurs CGU, leur empreinte et leurs clés API.

## Téléchargements de logiciels

| Besoin | Obligatoire pour le site ? | Notes |
|--------|----------------------------|--------|
| **Navigateur moderne** | Oui | SPA + WebGL (Verse 3D). |
| **Node (dev / API locale)** | Dev / hébergeur | `npm run dev`, `npm run dev:api`. |
| **Unreal Engine** | Non | Uniquement si **vous** bâtissez un pipeline desktop / Pixel Streaming — voir `docs/unreal-bridge.md`. |
| **Blender / DCC** | Non | Utile pour préparer glTF/GLB vers le hub navigateur (`/ue-aiouy`). |

## IA génératives (musique, image, vidéo, etc.)

- **Aucune génération serveur « magique »** n’est imposée dans ce repo : pas de cluster GPU propriétaire livré ici.
- **Versatilité** = possibilité de **brancher** des fournisseurs (API payantes ou open) via **vos** clés, **vos** budgets carbone et **vos** contrats légaux.
- **Empreinte** : réduire les appels inutiles (cache, résolutions modérées, batch), choisir des régions/ fournisseurs transparents, éviter les boucles de génération en continu dans l’UI.

## Entreprise, commerce, comptabilité, ministères

Aujourd’hui la base web couvre surtout : **marketplace**, **parcours utilisateur**, **Stripe (paiements / abonnements côté patterns documentés)**, **Atlas**, **CRM lead minimal**, contenu éditorial.

**Ne sont pas livrés** dans ce dépôt : ERP complet, comptabilité générale, paie, gestion ministérielle, chaîne logistique bout-en-bout automatisée, conformité sectorielle sans configuration métier. Tout cela relève de **projets d’intégration** avec des logiciels métiers et des **consultants** — à documenter par cas d’usage.

## Sécurité

Objectif : **défense en profondeur** (HTTPS, secrets hors bundle, validation Zod côté API, rate limits, Helmet sur l’API, moindre privilège).  
Aucun système n’est **« impénétrable »** : la posture honnête = **surveillance**, **mises à jour**, **réponse aux incidents**.
