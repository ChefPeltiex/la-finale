/**
 * CirculAI φ — AWS Lambda handler for server-side A/B (API Gateway HTTP API v2).
 *
 * Env:
 *   EVENT_COLLECTOR_URL — optional HTTPS sink (JSON); skipped if unset
 *   EXPERIMENT_ID — cookie / experiment key (default `circulai_phi_v1`, align with `server/ab-server.js`)
 *   COOKIE_DOMAIN — optional `Domain=...` fragment for Set-Cookie
 *   ASSIGN_PROB_CONTROL — default "0.5" (fraction assigned to control; rest → phi)
 *
 * HTTP API v2: multiple Set-Cookie via top-level `cookies` string array on the response.
 */

import { randomUUID } from "node:crypto";

const VARIANTS = new Set(["control", "phi"]);
const USER_COOKIE = "circulai_user_id";

function experimentKey() {
  return process.env.EXPERIMENT_ID || process.env.CIRCULAI_EXPERIMENT_KEY || "circulai_phi_v1";
}

function assignProbControl() {
  const raw = process.env.ASSIGN_PROB_CONTROL ?? "0.5";
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0 || n >= 1) return 0.5;
  return n;
}

function assignVariant() {
  return Math.random() < assignProbControl() ? "control" : "phi";
}

function maxAgeSecondsOneYear() {
  return 365 * 24 * 60 * 60;
}

function parseCookieHeader(cookieHeader) {
  const out = Object.create(null);
  if (!cookieHeader) return out;
  for (const part of String(cookieHeader).split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if (key) out[key] = decodeURIComponent(val);
  }
  return out;
}

function parseCookies(event) {
  const fromArray = event.cookies;
  if (Array.isArray(fromArray) && fromArray.length) {
    const out = Object.create(null);
    for (const c of fromArray) {
      const i = String(c).indexOf("=");
      if (i > 0) out[c.slice(0, i).trim()] = decodeURIComponent(c.slice(i + 1));
    }
    return out;
  }
  const h = event.headers?.cookie ?? event.headers?.Cookie ?? "";
  return parseCookieHeader(h);
}

function buildUserCookie(value) {
  const domain = process.env.COOKIE_DOMAIN ? `; Domain=${process.env.COOKIE_DOMAIN}` : "";
  const maxAge = maxAgeSecondsOneYear();
  return `${USER_COOKIE}=${encodeURIComponent(value)}; Path=/${domain}; Max-Age=${maxAge}; Secure; HttpOnly; SameSite=Lax`;
}

function buildVariantCookie(expKey, value) {
  const domain = process.env.COOKIE_DOMAIN ? `; Domain=${process.env.COOKIE_DOMAIN}` : "";
  const maxAge = maxAgeSecondsOneYear();
  return `${expKey}=${encodeURIComponent(value)}; Path=/${domain}; Max-Age=${maxAge}; Secure; SameSite=Lax`;
}

async function sendEvent(payload) {
  const url = process.env.EVENT_COLLECTOR_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(2000),
    });
  } catch {
    /* fire-and-forget */
  }
}

function normalizeRequest(event) {
  const rawPath = event.rawPath ?? event.path ?? "/";
  const path = String(rawPath).split("?")[0] || "/";
  const method = String(
    event.requestContext?.http?.method ?? event.httpMethod ?? "GET",
  ).toUpperCase();
  return { path, method };
}

function readJsonBody(event) {
  if (!event.body) return { ok: true, value: {} };
  try {
    const raw = event.isBase64Encoded
      ? Buffer.from(event.body, "base64").toString("utf8")
      : event.body;
    if (!raw || !String(raw).trim()) return { ok: true, value: {} };
    return { ok: true, value: JSON.parse(raw) };
  } catch {
    return { ok: false, value: null };
  }
}

function jsonResponse(statusCode, bodyObj, setCookies) {
  const res = {
    statusCode,
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(bodyObj),
  };
  if (setCookies && setCookies.length > 0) {
    res.cookies = setCookies;
  }
  return res;
}

function pathIs(path, suffix) {
  return path === suffix || path.endsWith(suffix);
}

export async function handler(event) {
  const { path, method } = normalizeRequest(event);
  const expKey = experimentKey();

  const cookies = parseCookies(event);
  const setCookies = [];

  let userId = cookies[USER_COOKIE];
  if (!userId) {
    userId = randomUUID();
    setCookies.push(buildUserCookie(userId));
  }

  let variant = cookies[expKey];
  let newAssignment = false;
  if (!variant || !VARIANTS.has(variant)) {
    variant = assignVariant();
    setCookies.push(buildVariantCookie(expKey, variant));
    newAssignment = true;
  }

  const ts = new Date().toISOString();

  if (newAssignment) {
    await sendEvent({
      event: "experiment_assign",
      experiment: expKey,
      userId,
      variant,
      ts,
      path,
    });
  }

  if (method === "GET" && pathIs(path, "/api/experiment")) {
    return jsonResponse(200, { experiment: expKey, variant, userId }, setCookies);
  }

  if (method === "POST" && pathIs(path, "/api/experiment/convert")) {
    const parsed = readJsonBody(event);
    if (!parsed.ok) {
      return jsonResponse(400, { error: "invalid_json" }, setCookies);
    }
    const goal = parsed.value?.goal ?? "default";
    await sendEvent({
      event: "experiment_convert",
      experiment: expKey,
      userId,
      variant,
      goal,
      ts: new Date().toISOString(),
    });
    return jsonResponse(200, { ok: true }, setCookies);
  }

  if (method === "GET" && (path === "/" || path === "")) {
    return jsonResponse(
      200,
      {
        message: "CirculAI φ A/B Lambda",
        hint: "GET /api/experiment or POST /api/experiment/convert",
        experiment: expKey,
        variant,
        userId,
      },
      setCookies,
    );
  }

  return jsonResponse(404, { error: "not_found", path, method }, setCookies);
}
