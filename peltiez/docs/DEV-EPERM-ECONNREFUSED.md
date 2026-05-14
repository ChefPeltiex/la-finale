# EPERM (npm ci) et ECONNREFUSED (API)

## EPERM sous Windows

Souvent : un processus **node** / **vite** garde un fichier ouvert (ex. `esbuild.exe`), antivirus, ou dossier projet sous synchronisation (OneDrive).

**Pistes :**

1. Fermer les terminaux qui tournent `npm run dev` / `vite`.
2. `npm run repair:npm-ci` ou `.\scripts\repair-npm-ci-eperm.ps1`.
3. `npm run dev:clean:no-dev` (purge caches + `npm ci` + rapport) : `.\scripts\dev-universal.ps1 -NoDev`.

## ECONNREFUSED sur `/api/...`

Le front proxifie vers l’API (port **8787** par défaut, variables `PORT` / `IGOR_API_PORT`). Si l’API n’est pas démarrée, le navigateur affiche une erreur réseau.

**Commandes :**

- API seule : `npm run dev:api`
- Front + API : `npm run dev:stack`

## Scripts utiles

| Script | Rôle |
|--------|------|
| `npm run verify` | lint + typecheck + build |
| `npm run multiverse:guard` | garde-fou Node (doublons React, imports dynamiques, sonde API) |
| `npm run guardian:ps` | même idée côté PowerShell + rapport HTML |
| `npm run dev:clean` | `dev-universal.ps1` (purge, `npm ci`, rapport, puis Vite) |
| `npm run dev:clean:no-dev` | idem sans lancer Vite |
