/**
 * Node 18+.
 * Install deps (from repo root): npm i express cookie-parser uuid axios
 *
 * Standalone server-side A/B demo — not wired into server/index.js by default.
 * Run: node server/ab-server.js
 * Or:  npm run ab:server-demo
 */

import express from "express";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const PORT = Number(process.env.AB_SERVER_PORT || process.env.PORT || 3847);
const ANALYTICS_URL = process.env.CIRCULAI_ANALYTICS_URL || "";

const EXPERIMENT_KEY = "circulai_phi_v1";
const VARIANTS = ["control", "phi"];
const ASSIGN_PROB = 0.5;

const USER_COOKIE = "circulai_user_id";

const COOKIE_BASE = {
  path: "/",
  sameSite: "lax",
  maxAge: 365 * 24 * 60 * 60 * 1000,
};

const app = express();
app.use(cookieParser());
app.use(express.json());

function assignVariant() {
  return Math.random() < ASSIGN_PROB ? VARIANTS[1] : VARIANTS[0];
}

/**
 * Demo / optional sink: set CIRCULAI_ANALYTICS_URL to POST JSON payloads.
 * Intended to be invoked only when a **new** experiment cookie is assigned
 * (see middleware branch that sets the cookie).
 */
async function sendEvent(payload) {
  if (ANALYTICS_URL) {
    try {
      await axios.post(ANALYTICS_URL, payload, { timeout: 8000 });
    } catch (err) {
      console.warn("[ab-server] sendEvent POST failed:", err?.message || err);
    }
    return;
  }
  console.info("[ab-server demo] sendEvent:", JSON.stringify(payload));
}

function ensureUserAndExperiment(req, res, next) {
  let userId = req.cookies[USER_COOKIE];
  if (!userId) {
    userId = uuidv4();
    res.cookie(USER_COOKIE, userId, { ...COOKIE_BASE, httpOnly: true });
  }
  req.circulai_user_id = userId;

  let variant = req.cookies[EXPERIMENT_KEY];
  if (!variant || !VARIANTS.includes(variant)) {
    variant = assignVariant();
    res.cookie(EXPERIMENT_KEY, variant, { ...COOKIE_BASE, httpOnly: false });
    void sendEvent({
      event: "experiment_assign",
      experiment: EXPERIMENT_KEY,
      userId,
      variant,
      ts: new Date().toISOString(),
    });
  }
  req.experimentVariant = variant;
  next();
}

app.use(ensureUserAndExperiment);

app.get("/api/experiment", (req, res) => {
  res.json({
    experiment: EXPERIMENT_KEY,
    variant: req.experimentVariant,
    userId: req.circulai_user_id,
  });
});

app.post("/api/experiment/convert", (req, res) => {
  const goal = req.body?.goal ?? "default";
  const payload = {
    event: "experiment_convert",
    experiment: EXPERIMENT_KEY,
    userId: req.circulai_user_id,
    variant: req.experimentVariant,
    goal,
    ts: new Date().toISOString(),
  };
  if (ANALYTICS_URL) {
    void axios
      .post(ANALYTICS_URL, payload, { timeout: 8000 })
      .catch((err) =>
        console.warn("[ab-server] convert POST failed:", err?.message || err),
      );
  } else {
    console.info("[ab-server demo] convert:", JSON.stringify(payload));
  }
  res.json({ ok: true });
});

app.get("/", (_req, res) => {
  res.type("html").send(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CirculAI — A/B server demo</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 42rem; margin: 2rem auto; padding: 0 1rem; }
    code { background: #f4f4f5; padding: 0.1em 0.35em; border-radius: 4px; }
    pre { background: #18181b; color: #fafafa; padding: 1rem; border-radius: 8px; overflow: auto; }
    button { padding: 0.5rem 1rem; cursor: pointer; margin-top: 0.75rem; }
  </style>
</head>
<body>
  <h1>A/B server demo</h1>
  <p>Standalone Express app (<code>server/ab-server.js</code>). Assignment cookies + <code>GET /api/experiment</code>.</p>
  <p><button type="button" id="load">Charger /api/experiment</button></p>
  <pre id="out">{}</pre>
  <p><button type="button" id="convert">POST /api/experiment/convert</button></p>
  <pre id="conv">—</pre>
  <script>
    async function loadExperiment() {
      const r = await fetch('/api/experiment', { credentials: 'include' });
      document.getElementById('out').textContent = JSON.stringify(await r.json(), null, 2);
    }
    document.getElementById('load').onclick = loadExperiment;
    document.getElementById('convert').onclick = async () => {
      const r = await fetch('/api/experiment/convert', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: 'demo_cta' }),
      });
      document.getElementById('conv').textContent = JSON.stringify(await r.json(), null, 2);
    };
    loadExperiment();
  </script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(`[ab-server] demo listening on http://localhost:${PORT}`);
});
