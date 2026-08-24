# Procédure de validation visuelle

Objectif : observer l'application toi-même, sur ton écran et sur ton téléphone,
puis me transmettre des captures et une liste de problèmes.

Aucune modification d'architecture ni de mécanique n'est faite pendant cette
passe. On regarde, on note, on corrige ensuite.

---

## 0. Avant de commencer

Ouvre une invite de commandes dans le dossier du projet :

```
cd "C:\Users\CHEFP\OneDrive\Desktop\la finale\horaisme"
```

Si c'est la première fois depuis un `git clone` ou une mise à jour :

```
npm install
```

---

## 1. Ouvrir l'application sur l'ordinateur

```
npm run dev
```

Puis ouvre <http://localhost:5184> dans Edge ou Chrome.

Le port est fixe (`--strictPort`) : s'il est déjà pris, la commande échoue au
lieu de basculer en silence sur un autre port. Dans ce cas, ferme l'ancienne
fenêtre de terminal qui fait encore tourner un serveur.

Pour arrêter le serveur : `Ctrl + C` dans le terminal.

---

## 2. Tester les écrans principaux

Huit routes existent. Passe-les une par une par la navigation, pas par l'URL —
on veut aussi vérifier que la navigation elle-même fonctionne.

| Écran | URL | À regarder |
| --- | --- | --- |
| Seuil | `/` | Écran d'entrée, avant toute navigation |
| Aujourd'hui | `/aujourdhui` | La proposition du jour, « Rien aujourd'hui » bien présent |
| Terrain | `/terrain` | Relevé dessiné (pas de fausse carte), lieux révélés |
| Missions | `/missions` | Une seule opération réelle, aucune carte verrouillée factice |
| Parcours | `/parcours` | Vide au départ, se remplit après une opération |
| Découvrir | `/decouvrir` | Atlas consulté, aucun défilement infini, aucune tendance |
| Moi | `/moi` | Sources désactivables, XP, effacement des traces |
| Opération | `/operation/angle-mort` | Voir section 3 |

Pour chaque écran, note :

- ce qui est illisible, tronqué, mal aligné ou trop serré ;
- ce qui déborde horizontalement ;
- ce qui ne ressemble pas aux références visuelles ;
- tout texte qui sonne faux, moralisateur ou publicitaire.

---

## 3. Tester « L'angle mort »

Depuis **Missions** ou **Aujourd'hui**, ouvre l'opération. Le parcours complet
compte cinq étapes.

1. **Fragment** — l'indice de départ. Vérifie qu'il donne envie de sortir et
   qu'il ne dit pas déjà la réponse.
2. **Inventaire** — le bouton de passage doit rester **désactivé tant que tu
   n'as pas saisi deux hypothèses concurrentes**. Essaie de forcer le passage
   avec une seule : ça doit refuser.
3. **Sortie** — l'écran qui te fait quitter le téléphone. C'est ici que se
   teste le mode poche (section 5).
4. **Constat** — ce que tu as réellement observé sur place.
5. **Ancrage** — bascule en panneau crème, affiche le Registre avec les
   étiquettes FAIT / PLAUSIBLE / SIMULÉ / INCONNU et permet de corriger une
   hypothèse du système.

Fais-la **deux fois**, dans les deux branches :

- une fois en confirmant que tu as trouvé ;
- une fois en déclarant un **échec sincère** — il doit être récompensé, pas puni.

Entre les deux passages, remets à zéro : **Moi → Tout effacer**. Sinon la
mémoire garde le premier ancrage et la seconde lecture est faussée.

---

## 4. Vérifier Avant / Pendant / Après

Ce sont trois états du même terrain, pas trois écrans.

- **Avant** — sur Aujourd'hui et Missions, avant d'avoir rien fait. Parcours
  est vide, Terrain n'a aucun point.
- **Pendant** — pendant l'opération. L'en-tête doit montrer où tu en es dans la
  boucle, sans jamais t'expliquer la boucle.
- **Après** — une fois l'opération close, vérifie **les trois** :
  - **Parcours** : l'ancrage et le Registre apparaissent ;
  - **Terrain** : un lieu révélé, avec ses coordonnées réelles ;
  - **En-tête** : les XP ont bougé et le niveau est recalculé.

Le point important : les XP doivent être liés à l'événement réel déclaré, pas
au temps passé dans l'application.

---

## 5. Vérifier le mode poche

À l'étape **Sortie**, active le mode poche.

L'écran doit se réduire à un glyphe H qui respire et une seule ligne de texte.
Tout le reste disparaît. C'est l'application qui s'efface pendant que tu
marches.

Vérifie que :

- rien ne clignote ni ne sollicite ;
- on en sort facilement ;
- l'état de l'opération est intact en sortant.

---

## 6. Ouvrir sur le téléphone (même réseau Wi-Fi)

Sur l'ordinateur, lance la variante réseau :

```
npm run dev:lan
```

Sur le téléphone, connecté au **même Wi-Fi**, ouvre :

```
http://10.0.0.81:5184
```

> Si l'adresse a changé, retrouve-la avec `ipconfig` et prends la ligne
> « Adresse IPv4 ».

### Si la page ne charge pas

Le pare-feu Windows bloque les connexions entrantes par défaut. Ouvre une
invite de commandes **en administrateur** et autorise le port :

```
netsh advfirewall firewall add rule name="Horaisme dev 5184" dir=in action=allow protocol=TCP localport=5184
```

Pour retirer l'autorisation quand tu as fini :

```
netsh advfirewall firewall delete rule name="Horaisme dev 5184"
```

### Ce qui ne marchera pas sur le téléphone, et c'est normal

En `http://` sur une adresse réseau, le navigateur **refuse la géolocalisation**
(elle exige une origine sécurisée). L'application ne plante pas : la position
tombe simplement en statut `inconnu`.

C'est involontairement un bon test — tu vois exactement comment l'app se
comporte quand une source est absente, et si elle reste honnête au lieu
d'inventer.

Pour tester la vraie position, il faut le faire sur l'ordinateur en
`localhost`, qui est considéré comme une origine sécurisée.

### Sur le téléphone, regarde surtout

- la barre de navigation du bas : lisibilité et taille des cibles ;
- les débordements horizontaux ;
- le mode poche en conditions réelles, dehors, en marchant ;
- la lisibilité en plein soleil.

---

## 7. Me transmettre les résultats

### Captures

- **Windows** : `Win + Maj + S` pour une sélection, ou `Win + Impr. écran` pour
  l'écran entier (les fichiers vont dans `Images\Captures d'écran`).
- **Téléphone** : capture d'écran habituelle.

Nomme-les de façon reconnaissable, par exemple `mobile-aujourdhui.png`,
`desktop-ancrage.png`.

### Ce qui m'est le plus utile

Pour chaque problème, une ligne suffit :

```
[écran] [appareil] ce que je vois → ce que j'attendais
```

Exemple :

```
Ancrage / iPhone / le panneau crème déborde à droite → devrait tenir dans la largeur
```

Une phrase précise vaut mieux qu'un long paragraphe. Si tu hésites entre
« c'est un bug » et « c'est une préférence », note-le quand même et dis-le.

---

## Captures automatiques déjà disponibles

Une vérification navigateur a déjà été faite via Edge piloté en CDP. Les images
sont dans `.captures/` (non versionné) :

- `.captures/` — les huit routes en desktop 1440×900 et mobile 390×844 ;
- `.captures/operation/` — les cinq étapes de « L'angle mort », le mode poche,
  la clôture, puis Parcours / Terrain / Moi après coup.

Pour les régénérer :

```
npm run captures
npm run captures:operation
npm run audit:cibles
```

Ces scripts pilotent l'Edge déjà installé, ils ne téléchargent aucun navigateur.

Elles ne remplacent pas ton regard : elles montrent ce que la machine mesure,
pas ce qui te dérange à l'usage.
