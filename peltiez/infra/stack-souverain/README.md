# Stack souveraine — CirculAI / Egor69

| Rôle | Outil | Ce dépôt |
|------|--------|----------|
| Cerveau dev | **Cursor** | Édition `peltiez/` |
| IA locales | **Ollama** | Service `ollama` |
| Centre de contrôle | **Open WebUI** | http://localhost:3000 |
| Agents | **CrewAI** | Phase 2 (venv, voir ci-dessous) |
| Mémoire | **Qdrant** | http://localhost:6333 |
| Isolation | **Docker** | Ce `docker-compose.yml` |
| Audit | **GitHub** | Dépôt `la-finale` |

## Prérequis

- [Docker Desktop](https://docs.docker.com/desktop/) (Windows/macOS/Linux)
- 8 Go RAM libres minimum (16 Go recommandé pour `llama3.2`)

> **Éviter `pip install open-webui` en prod** : l’image Docker officielle est plus simple à maintenir (mises à jour, volumes, lien Ollama).

## Démarrage rapide (Windows)

```powershell
cd peltiez\infra\stack-souverain
.\scripts\start.ps1
.\scripts\pull-models.ps1
```

1. Ouvrir http://localhost:3000  
2. Créer le **premier compte** → il devient **admin**  
3. **Settings → Connections** : vérifier Ollama (`http://ollama:11434` est déjà configuré)  
4. **Workspace → Knowledge** : importer les dossiers montés  
   - `/docs/circulai` (kit municipal)  
   - `/docs/circulai-public` (miroir public)  
   - ou glisser `peltiez/docs/circulai/*.md` depuis l’explorateur Windows via l’UI  

## Arrêt / logs

```powershell
docker compose down
docker compose logs -f open-webui
```

## CrewAI (phase 2)

CrewAI ne tourne pas encore dans ce compose. Connexion typique :

```bash
python -m venv .venv-crew
# activer le venv
pip install crewai crewai-tools qdrant-client
```

Variables :

- `OLLAMA_BASE_URL=http://localhost:11434`
- `QDRANT_URL=http://localhost:6333`

Les agents peuvent lire le même Qdrant que tu alimentes avec les docs CirculAI.

## Cursor

- Code produit : `peltiez/src`  
- Docs pilote : `peltiez/docs/circulai`  
- Ce stack : tests locaux **sans** envoyer les données municipales vers le cloud.

## Sécurité & énergie (notes 2026)

- **Énergie :** chaque requête Ollama/Open WebUI consomme CPU/GPU — préférer des prompts courts et le kit local pour les docs municipaux.
- **Post-quantique :** surveiller la migration TLS/chiffrement (NIST PQC) sur les expositions publiques avant 2027–2028 ; pas de promesse « quantique » dans le produit.
- **Doc interne :** `peltiez/public/docs/circulai/inspiration-science-2026.md` (métaphores science → pilote CirculAI).

## Dépannage

| Problème | Action |
|----------|--------|
| Port 3000 occupé | Changer `OPEN_WEBUI_HOST_PORT` dans `.env` |
| Pas de modèle | `.\scripts\pull-models.ps1` |
| Déconnecté à chaque restart | Regénérer `WEBUI_SECRET_KEY` fixe via `.\scripts\new-secret.ps1` |
| GPU NVIDIA | Remplacer l’image Open WebUI par `main-cuda` et activer GPU dans Docker |
