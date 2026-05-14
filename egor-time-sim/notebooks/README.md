# Notebook Jupyter

Créez `notebooks/exploration.ipynb` localement (Jupyter : New Notebook) ou exécutez :

```python
import json, pathlib, numpy as np
p = pathlib.Path("..") / "results" / "last_result.json"
d = json.loads(p.read_text(encoding="utf-8"))
ad = d["allan_deviation"]
taus = sorted(float(k) for k in ad)
sig = np.array([ad[str(t)] for t in taus])
print(len(taus), float(sig.min()), float(sig.max()))
```

Depuis le dossier `notebooks/` après un `run_batch` réussi.
