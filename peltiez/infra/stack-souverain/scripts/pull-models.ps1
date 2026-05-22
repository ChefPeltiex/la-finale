# Télécharge les modèles Ollama recommandés pour chat + RAG
$ErrorActionPreference = "Stop"
$chat = if ($env:CHAT_MODEL) { $env:CHAT_MODEL } else { "llama3.2" }
$embed = if ($env:EMBED_MODEL) { $env:EMBED_MODEL } else { "nomic-embed-text" }

Write-Host "Modèles : $chat (chat), $embed (embeddings)"
docker exec circulai-ollama ollama pull $chat
docker exec circulai-ollama ollama pull $embed
docker exec circulai-ollama ollama list
