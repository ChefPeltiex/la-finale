import { z } from "zod";

export const zEmailOptional = z
  .string()
  .trim()
  .email()
  .optional()
  .or(z.literal("").transform(() => undefined));

export function jsonOk(res, payload) {
  return res.status(200).json(payload);
}

export function jsonBad(res, code, details) {
  return res.status(400).json({ error: code, details: details || undefined });
}

export const zCheckoutBody = z.object({
  priceId: z.string().trim().min(1),
  mode: z.enum(["payment", "subscription"]).optional(),
  passSouverain: z.union([z.boolean(), z.string()]).optional(),
  tier: z.string().optional(),
  metadata: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
});

export const zPaymentIntentBody = z.object({
  priceId: z.string().trim().min(1),
  tier: z.string().trim().min(1),
  mode: z.enum(["payment", "subscription"]).optional(),
  email: zEmailOptional,
});

function emptyToUndefined(v) {
  if (v == null) return undefined;
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
}

export const zCrmLeadBody = z.object({
  email: z.string().trim().email(),
  name: z.preprocess(emptyToUndefined, z.string().trim().max(200).optional()),
  source: z.preprocess(emptyToUndefined, z.string().trim().max(200).optional()),
  message: z.preprocess(emptyToUndefined, z.string().trim().max(4000).optional()),
  intent: z.preprocess(emptyToUndefined, z.string().trim().max(200).optional()),
  page_path: z.preprocess(emptyToUndefined, z.string().trim().max(500).optional()),
  utm_source: z.preprocess(emptyToUndefined, z.string().trim().max(120).optional()),
  utm_medium: z.preprocess(emptyToUndefined, z.string().trim().max(120).optional()),
  utm_campaign: z.preprocess(emptyToUndefined, z.string().trim().max(160).optional()),
});

