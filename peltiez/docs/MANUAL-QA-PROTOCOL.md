# Protocole QA manuelle (obligatoire avant release)

Ce document formalise les vérifications **humaines** que l’automatisation (`npm run verify`, `verify:deep`) ne remplace pas.  
**Carte des routes** : `/carte-site` · **Cadre produit** : `/manuel` · **Perf (pistes)** : `docs/performance.md` · **E2E smoke** : `npm run test:e2e` (après `npx playwright install chromium`) · **Deck investisseur** : `docs/INVESTOR-DECK-10-SLIDES.md` · **Schéma routes↔API** : `docs/ARCHITECTURE-ROUTES-API.md`

---

## Test 1 — Navigation totale

| Étape | Critère de succès |
|--------|-------------------|
| Liens | Cliquer **tous** les liens visibles (navbar, footer, panneaux latéraux, contenu) : pas de 404 inattendu, pas de chunk Vite cassé. |
| Portails | Parcourir les hubs / portails listés sur la carte du site ; vérifier le **chargement lazy** (spinner puis contenu). |
| Routes | Ouvrir les URLs critiques : `/`, `/marketplace`, `/profil`, `/legal`, `/charte`, `/hub-reparation`, `/encyclopedie-biblique`, paiement `/abonnement` si applicable. |
| Retour arrière | Après navigation profonde : **Retour** navigateur → état cohérent (pas de page blanche, pas de double overlay). |
| Console | Onglet **Console** : idéalement **0 erreur** rouge ; noter les warnings (extensions, CORS, ressources manquantes). |

**Outils** : DevTools → Console, Network (filtrer Failed).

---

## Test 2 — Accessibilité

| Zone | Vérification |
|--------|----------------|
| Contrastes | Mode clair + sombre : texte sur fond lisible (repère : WCAG AA comme objectif minimal). |
| Typo | `data-igor-ui-scale` si présent : petit / moyen / grand ; zoom navigateur 100 % → 200 %. |
| Focus clavier | Tab à travers la page : ordre logique, **anneau de focus** visible, pas de piège clavier. |
| Labels | Boutons icône seuls : `aria-label` ; champs formulaire : `<label>` ou `aria-labelledby`. |

**Outils** : Lighthouse → Accessibility ; axe DevTools (optionnel).

---

## Test 3 — Performance

| Point | Action |
|--------|--------|
| Chargement | Network : **DOMContentLoaded** / ressources lourdes ; 3G simulée sur 2–3 pages clés. |
| Images | Filtrer `img` > 500 Ko ou dimensions disproportionnées ; WebP / lazy où pertinent. |
| Animations | Avec `prefers-reduced-motion: reduce` (OS) : pas de clignotement indispensable au parcours. |

**Référence** : `docs/performance.md`, build `npm run build` + `npm run preview`.

---

## Test 4 — Cohérence

- **Titres** : hiérarchie `h1` unique par vue, `h2`/`h3` cohérents.  
- **Couleurs** : tokens Tailwind / variables CSS (`index.css`), pas de hex « one-off » sauf exception documentée.  
- **Boutons** : primaire / secondaire / destructif alignés sur le design system (shadcn).  
- **Ton** : alignement avec le cadre `/manuel` (pro / clair sur les pages légales et transactionnelles).

---

## Test 5 — Cinq personas (3 actions chacune)

Pour **chaque** persona : accomplir **3 actions** concrètes (ex. « publier une annonce », « lire la charte », « ouvrir le Verse »), noter **frictions** (temps, confusion, erreur), puis **corriger** (ticket ou PR immédiate si bloquant).

### Grille à remplir (copier par release)

| Persona | Action 1 | Friction ? | Action 2 | Friction ? | Action 3 | Friction ? | Correctifs / PR |
|----------|----------|-------------|----------|-------------|----------|-------------|------------------|
| Senior | | | | | | | |
| Parent pressé | | | | | | | |
| Étudiant | | | | | | | |
| Artisan | | | | | | | |
| Explorateur cosmique | | | | | | | |

**Suggestions d’actions par persona**

- **Senior** : agrandir le texte ; lire le premier écran d’accueil ; trouver le contact / légal.  
- **Parent pressé** : arriver au marketplace en ≤3 clics ; trouver prix / soutien ; fermer overlays.  
- **Étudiant** : parcours jeu / quête courte ; partage social si présent ; dark mode.  
- **Artisan** : hub réparation ou artisans ; fiche annonce ; profil.  
- **Explorateur cosmique** : Etherealm / Netherealm / Outworld ou Verse ; pas de crash WebGL ; retour accueil.

---

## Gate minimal avant merge « sensible »

1. `npm run verify`  
2. `npm run verify:deep` (avant release ou grosse PR)  
3. **Tests 1–2** au minimum sur **Chrome** + **un** second navigateur ou mobile émulé si possible  
4. Tableau **Test 5** : au moins **1 ligne** remplie (même un seul persona) pour la release

Date / version / testeur : _______________
