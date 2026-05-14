import express from "express";
import cors from "cors";
import Stripe from "stripe";
import { SITE_TAGLINE } from "../src/lib/site.js";
import { createCorsOriginVerifier, parseCsv } from "./lib/origins.js";
import { rateLimitWindow } from "./lib/rateLimit.js";
import helmet from "helmet";
import { errorHandler, logRequests, withRequestId } from "./lib/requestContext.js";
import { jsonBad, zCheckoutBody, zCrmLeadBody, zPaymentIntentBody } from "./lib/validate.js";
import { countActiveStripeSubscriptions, getLedgerMeta } from "./subscriptionLedger.js";
import { handleStripeSubscriptionEvent } from "./stripeWebhookHandlers.js";
import { getFichesVivantesCount, getFichesVivantesPreview, getLivingSheetByScanId } from "./atlasVivantRepository.js";
import { convertScansToLiveSheets } from "./convertScansToLiveSheets.js";
import { RADAR_SCAN_TARGET } from "./lib/syntheticRadar.js";
import { appendCrmLead } from "./crmLeadStore.js";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __serverDir = path.dirname(fileURLToPath(import.meta.url));

const HOLDING_STRIPE_META = "Les Secrets du St-Laurent";
const PASS_TIER_SET = new Set(["netherealm", "etherealm", "outworld"]);

function isPlainObject(v) {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function asString(v) {
  return typeof v === "string" ? v : "";
}

/**
 * Noyau API IGOR — routes Stripe / CRM / santé.
 * Les engagements Loi 25 ou d’hébergement relèvent de la config réelle + juristes.
 */
export function createSovereignApp(processEnv = process.env) {
  const isProd = processEnv.NODE_ENV === "production";
  const getAllowedCsv = () =>
    processEnv.STRIPE_ALLOWED_ORIGINS || processEnv.PUBLIC_SITE_URL || "";

  const app = express();

  app.disable("x-powered-by");

  app.use(withRequestId());
  app.use(logRequests());

  app.use(
    helmet({
      // API JSON uniquement: pas de CSP ici (gérée côté front si besoin).
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
  });

  const corsVerify = createCorsOriginVerifier({ isProd, getAllowedCsv });

  app.use(
    cors({
      origin: corsVerify,
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "x-idempotency-key", "stripe-signature", "x-igor-atlas-token"],
    }),
  );

  // Limites body par défaut (routes sensibles peuvent définir plus petit).
  app.use(express.json({ limit: "256kb" }));
  app.use(express.urlencoded({ extended: false, limit: "256kb" }));

  // Rate limit global minimal pour éviter les abus triviales.
  app.use(rateLimitWindow({ name: "api", windowMs: 60_000, max: isProd ? 240 : 600 }));

  const checkoutLimit = rateLimitWindow({ name: "checkout", windowMs: 60_000, max: 40 });
  const paymentIntentLimit = rateLimitWindow({ name: "stripe-pi", windowMs: 60_000, max: 30 });
  const crmLimit = rateLimitWindow({ name: "crm", windowMs: 60_000, max: 30 });
  const atlasBatchLimit = rateLimitWindow({ name: "atlas-batch", windowMs: 60_000, max: 8 });

  app.get("/api/health", (_req, res) => {
    res.status(200).json({
      ok: true,
      service: "igor-sovereign-core",
      time: new Date().toISOString(),
      mode: isProd ? "production" : "development",
    });
  });

  /** Compteur Fiches vivantes (Atlas) — mis à jour après conversion batch. */
  app.get("/api/atlas/fiches-vivantes-count", (_req, res) => {
    try {
      res.status(200).json({
        fiches_vivantes_count: getFichesVivantesCount(),
        radar_scans_total: RADAR_SCAN_TARGET,
        time: new Date().toISOString(),
      });
    } catch {
      res.status(500).json({ error: "atlas_count_unavailable" });
    }
  });

  /** Liste courte d’aperçus (Fiches vivantes radar → Atlas). */
  app.get("/api/atlas/fiches-vivantes-preview", (req, res) => {
    try {
      const raw = req.query?.limit;
      const limit = raw != null ? Number(raw) : 24;
      res.status(200).json({
        items: getFichesVivantesPreview(limit),
        count: getFichesVivantesCount(),
        time: new Date().toISOString(),
      });
    } catch {
      res.status(500).json({ error: "atlas_preview_unavailable" });
    }
  });

  app.get("/api/atlas/fiche-vivante/:scanId", (req, res) => {
    try {
      const sheet = getLivingSheetByScanId(req.params.scanId);
      if (!sheet) return res.status(404).json({ error: "not_found" });
      res.status(200).json(sheet);
    } catch {
      res.status(500).json({ error: "atlas_sheet_unavailable" });
    }
  });

  /**
   * Lance convertScansToLiveSheets — body JSON optionnel : { reset?, offset?, limit? }.
   * Sécurité : si IGOR_ATLAS_BATCH_SECRET est défini, header `x-igor-atlas-token` requis.
   */
  app.post(
    "/api/atlas/convert-scans-to-live-sheets",
    atlasBatchLimit,
    async (req, res) => {
      const secret = processEnv.IGOR_ATLAS_BATCH_SECRET;
      if (secret) {
        const tok = req.headers["x-igor-atlas-token"];
        if (tok !== secret) return res.status(403).json({ error: "forbidden" });
      }
      try {
        const result = await convertScansToLiveSheets(req.body || {});
        return res.status(200).json({ ok: true, ...result });
      } catch (e) {
        if (!isProd) console.error("[atlas:convert]", e?.message || e);
        return res.status(500).json({ error: "atlas_convert_failed" });
      }
    },
  );

  /** Agrégats publics (pas d’emails) — alimenté par le webhook Stripe + fichier local. */
  app.get("/api/platform/metrics-live", (_req, res) => {
    try {
      const meta = getLedgerMeta();
      res.status(200).json({
        source: "stripe",
        stripeSubscriptionsActive: countActiveStripeSubscriptions(),
        ledgerUpdatedAt: meta.updatedAt || null,
      });
    } catch {
      res.status(500).json({ error: "metrics_unavailable" });
    }
  });

  app.post("/api/stripe/checkout", checkoutLimit, express.json({ limit: "128kb" }), async (req, res) => {
    const secretKey = processEnv.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return res.status(500).json({ error: "checkout_unavailable" });
    }

    const configuredSite = processEnv.PUBLIC_SITE_URL || "http://localhost:5173";
    const origin = asString(req.headers?.origin) || configuredSite;

    const allowedOrigins = parseCsv(processEnv.STRIPE_ALLOWED_ORIGINS || configuredSite || "");
    if (allowedOrigins.length > 0 && !allowedOrigins.includes(origin)) {
      return res.status(403).json({ error: "Origin not allowed" });
    }

    const parsed = zCheckoutBody.safeParse(isPlainObject(req.body) ? req.body : {});
    if (!parsed.success) return jsonBad(res, "invalid_body", parsed.error.flatten());
    const { priceId, mode = "payment", passSouverain: bodyPassFlag, tier: bodyTier, metadata: bodyMetadata } = parsed.data;
    if (mode !== "payment" && mode !== "subscription") return res.status(400).json({ error: "Invalid mode" });

    const allowedPriceIds = parseCsv(processEnv.STRIPE_ALLOWED_PRICE_IDS || "");
    if (allowedPriceIds.length > 0 && !allowedPriceIds.includes(priceId)) {
      return res.status(400).json({ error: "Unknown priceId" });
    }

    const passPriceId = processEnv.STRIPE_PASS_SOUVERAIN_PRICE_ID?.trim() || "";
    const isPassPrice =
      Boolean(passPriceId && priceId === passPriceId) ||
      Boolean(
        (bodyPassFlag === true || bodyPassFlag === "true" || bodyPassFlag === "1") &&
          passPriceId &&
          priceId === passPriceId,
      );
    /**
     * `holding` / `business_name`: étiquettes métadonnées uniquement ; les fonds vont au compte de STRIPE_SECRET_KEY.
     * Succès: `pass=` si `tier` reconnu, sinon `igor_pass` pour l’ancien prix Pass Souverain dédié.
     */
    const tierForUrl =
      bodyTier != null && PASS_TIER_SET.has(String(bodyTier)) ? String(bodyTier) : "";
    const successQuery = tierForUrl
      ? `success=1&pass=${encodeURIComponent(tierForUrl)}&session_id={CHECKOUT_SESSION_ID}`
      : isPassPrice
        ? "success=1&igor_pass=1&session_id={CHECKOUT_SESSION_ID}"
        : "success=1&session_id={CHECKOUT_SESSION_ID}";
    const successUrl = `${origin}/pricing?${successQuery}`;
    const cancelUrl = `${origin}/pricing?canceled=1`;

    try {
      const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });
      const idempotencyKey =
        req.headers["x-idempotency-key"] || `igor_${Date.now()}_${Math.random().toString(16).slice(2)}`;
      const extraMeta = bodyMetadata || {};
      const tierMeta =
        bodyTier != null && PASS_TIER_SET.has(String(bodyTier)) ? { tier: String(bodyTier) } : {};
      const metadata = {
        origin,
        created_at: new Date().toISOString(),
        business_name: HOLDING_STRIPE_META,
        holding: HOLDING_STRIPE_META,
        ...(isPassPrice ? { holding_name: HOLDING_STRIPE_META } : {}),
        ...extraMeta,
        ...tierMeta,
      };
      const session = await stripe.checkout.sessions.create(
        {
          mode,
          line_items: [{ price: priceId, quantity: 1 }],
          // Ne jamais dériver des URL de redirection à partir d’une entrée non approuvée.
          success_url: successUrl,
          cancel_url: cancelUrl,
          automatic_tax: { enabled: true },
          billing_address_collection: "auto",
          allow_promotion_codes: true,
          metadata,
        },
        { idempotencyKey },
      );

      return res.status(200).json({ url: session.url });
    } catch (e) {
      if (!isProd) {
        console.error("[stripe:checkout]", e?.message || e);
      }
      return res.status(500).json({ error: "checkout_unavailable" });
    }
  });

  /**
   * Stripe Payment Element — PaymentIntent (one-shot) ou premier encaissement d’abonnement (subscription incomplète).
   */
  app.post(
    "/api/stripe/payment-intent",
    paymentIntentLimit,
    express.json({ limit: "128kb" }),
    async (req, res) => {
      const secretKey = processEnv.STRIPE_SECRET_KEY;
      if (!secretKey) {
        return res.status(500).json({ error: "payment_intent_unavailable" });
      }

      const configuredSite = processEnv.PUBLIC_SITE_URL || "http://localhost:5173";
      const origin = asString(req.headers?.origin) || configuredSite;

      const allowedOrigins = parseCsv(processEnv.STRIPE_ALLOWED_ORIGINS || configuredSite || "");
      if (allowedOrigins.length > 0 && !allowedOrigins.includes(origin)) {
        return res.status(403).json({ error: "Origin not allowed" });
      }

      const parsed = zPaymentIntentBody.safeParse(isPlainObject(req.body) ? req.body : {});
      if (!parsed.success) return jsonBad(res, "invalid_body", parsed.error.flatten());
      const { priceId, tier: bodyTier, mode = "payment", email: bodyEmail } = parsed.data;
      if (!bodyTier || !PASS_TIER_SET.has(String(bodyTier))) {
        return res.status(400).json({ error: "Invalid or missing tier" });
      }
      if (mode !== "payment" && mode !== "subscription") return res.status(400).json({ error: "Invalid mode" });

      const allowedPriceIds = parseCsv(processEnv.STRIPE_ALLOWED_PRICE_IDS || "");
      if (allowedPriceIds.length > 0 && !allowedPriceIds.includes(priceId)) {
        return res.status(400).json({ error: "Unknown priceId" });
      }

      const stripeMeta = {
        holding: HOLDING_STRIPE_META,
        business_name: HOLDING_STRIPE_META,
        tier: String(bodyTier),
        origin,
        created_at: new Date().toISOString(),
      };

      try {
        const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });
        const idempotencyKey =
          req.headers["x-idempotency-key"] || `igor_pi_${Date.now()}_${Math.random().toString(16).slice(2)}`;

        const price = await stripe.prices.retrieve(priceId);
        const isRecurring = Boolean(price.recurring);
        if (mode === "subscription" && !isRecurring) {
          return res.status(400).json({ error: "Price is not recurring" });
        }
        if (mode === "payment" && isRecurring) {
          return res.status(400).json({ error: "Use mode subscription for recurring prices" });
        }

        if (mode === "payment") {
          if (price.unit_amount == null) {
            return res.status(400).json({ error: "Price has no fixed unit amount" });
          }
          const pi = await stripe.paymentIntents.create(
            {
              amount: price.unit_amount,
              currency: price.currency || "cad",
              automatic_payment_methods: { enabled: true },
              metadata: stripeMeta,
            },
            { idempotencyKey },
          );
          if (!pi.client_secret) return res.status(500).json({ error: "missing_client_secret" });
          return res.status(200).json({ clientSecret: pi.client_secret, kind: "payment" });
        }

        const email = bodyEmail || undefined;
        const customer = await stripe.customers.create(
          { email, metadata: stripeMeta },
          { idempotencyKey: `${idempotencyKey}_cust` },
        );

        const subscription = await stripe.subscriptions.create(
          {
            customer: customer.id,
            items: [{ price: priceId }],
            payment_behavior: "default_incomplete",
            payment_settings: { save_default_payment_method: "on_subscription" },
            metadata: stripeMeta,
            expand: ["latest_invoice.payment_intent"],
          },
          { idempotencyKey: `${idempotencyKey}_sub` },
        );

        const invoice = subscription.latest_invoice;
        const piInner =
          invoice && typeof invoice === "object" && invoice.payment_intent
            ? invoice.payment_intent
            : null;
        const clientSecret =
          piInner && typeof piInner === "object" && piInner.client_secret ? piInner.client_secret : null;
        if (!clientSecret) return res.status(500).json({ error: "missing_client_secret" });
        return res.status(200).json({ clientSecret, kind: "subscription" });
      } catch (e) {
        if (!isProd) console.error("[stripe:payment-intent]", e?.message || e);
        return res.status(500).json({ error: "payment_intent_unavailable" });
      }
    },
  );

  // Webhook : limiter fortement + body raw requis pour la signature.
  const webhookLimit = rateLimitWindow({ name: "stripe-webhook", windowMs: 60_000, max: isProd ? 60 : 240 });
  app.post("/api/stripe/webhook", webhookLimit, express.raw({ type: "*/*" }), async (req, res) => {
    const secretKey = processEnv.STRIPE_SECRET_KEY;
    const webhookSecret = processEnv.STRIPE_WEBHOOK_SECRET;
    if (!secretKey) return res.status(500).send("Missing STRIPE_SECRET_KEY");
    if (!webhookSecret) return res.status(500).send("Missing STRIPE_WEBHOOK_SECRET");

    try {
      const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });
      const sig = req.headers["stripe-signature"];
      if (typeof sig !== "string" || !sig) return res.status(400).send("Missing signature");
      const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

      if (!isProd) {
        console.log("[stripe:webhook]", event.type, event.id);
      }

      try {
        await handleStripeSubscriptionEvent(stripe, event, processEnv);
      } catch (syncErr) {
        console.error("[stripe:webhook:sync]", syncErr?.message || syncErr);
        return res.status(500).send("Webhook sync failed");
      }

      return res.status(200).json({ received: true });
    } catch (e) {
      return res.status(400).send("Webhook error");
    }
  });

  app.post("/api/crm/lead", crmLimit, express.json({ limit: "64kb" }), (req, res) => {
    const parsed = zCrmLeadBody.safeParse(isPlainObject(req.body) ? req.body : {});
    if (!parsed.success) return jsonBad(res, "invalid_body", parsed.error.flatten());
    const row = parsed.data;
    const emailRaw = row.email;
    const forwarded = asString(req.headers?.["x-forwarded-for"]);
    const clientIp =
      (forwarded && forwarded.split(",")[0].trim()) || asString(req.socket?.remoteAddress) || "";

    const record = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...row,
      ip: clientIp || undefined,
    };

    try {
      appendCrmLead(record);
    } catch (e) {
      if (!isProd) console.error("[crm:lead:persist]", e?.message || e);
      return res.status(500).json({ error: "crm_persist_failed" });
    }

    if (!isProd) {
      const at = emailRaw.indexOf("@");
      const redacted = at > 0 ? `${emailRaw[0]}***${emailRaw.slice(at)}` : "[invalid]";
      console.log("[crm:lead]", {
        id: record.id,
        email: redacted,
        source: row.source || null,
        page_path: row.page_path || null,
        len: (row.message || "").length,
      });
    }

    return res.status(200).json({
      ok: true,
      id: record.id,
      merci: `${SITE_TAGLINE} Votre demande a été enregistrée.`,
    });
  });

  /**
   * Pré-lancement / PaaS : servir le build Vite (`dist/`) depuis le même processus que l’API
   * (évite nginx pour une première mise en ligne). Activer avec SERVE_SPA_DIST=1 en production
   * après `npm run build`.
   */
  if (isProd && asString(processEnv.SERVE_SPA_DIST) === "1") {
    const distPath = path.join(__serverDir, "..", "dist");
    const indexHtml = path.join(distPath, "index.html");
    if (fs.existsSync(indexHtml)) {
      app.use(
        express.static(distPath, {
          maxAge: "2h",
          index: false,
        }),
      );
      app.use((req, res, next) => {
        if (req.path.startsWith("/api")) return next();
        if (req.method !== "GET" && req.method !== "HEAD") return next();
        res.sendFile(indexHtml, (err) => {
          if (err) next(err);
        });
      });
    } else {
      console.warn("[serve_spa_dist] dist/index.html introuvable — exécuter npm run build avant le démarrage.");
    }
  }

  // Handler final d'erreurs (JSON + requestId)
  app.use(errorHandler(isProd));

  return app;
}
