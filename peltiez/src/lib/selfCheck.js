import { base44 } from "@/api/base44Client";

export async function runSelfCheck() {
  const report = {
    ok: true,
    ts: new Date().toISOString(),
    checks: [],
  };

  const push = (name, ok, detail) => {
    report.checks.push({ name, ok: Boolean(ok), detail: detail || "" });
    if (!ok) report.ok = false;
  };

  push("stripe_env", Boolean(import.meta.env.VITE_STRIPE_CHECKOUT_ENDPOINT && import.meta.env.VITE_STRIPE_NUGGET_PRICE_ID), "Pricing/Checkout vars");

  // Check if checkout endpoint looks configured (no network assumptions here)
  try {
    const endpoint = import.meta.env.VITE_STRIPE_CHECKOUT_ENDPOINT || "";
    const absolute = /^https?:\/\//i.test(endpoint);
    push(
      "stripe_endpoint_format",
      Boolean(endpoint) && (endpoint.startsWith("/") || absolute),
      endpoint ? `endpoint=${endpoint}` : "missing"
    );
  } catch (e) {
    push("stripe_endpoint_format", false, String(e?.message || e));
  }

  // Soft reachability check (best-effort, non-blocking)
  try {
    const endpoint = import.meta.env.VITE_STRIPE_CHECKOUT_ENDPOINT || "";
    if (endpoint) {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 2500);
      const res = await fetch(endpoint, { method: "OPTIONS", mode: "cors", signal: ctrl.signal }).catch(() => null);
      clearTimeout(t);
      push("stripe_endpoint_reachable", Boolean(res), res ? `status=${res.status}` : "unreachable/blocked");
    } else {
      push("stripe_endpoint_reachable", false, "missing");
    }
  } catch (e) {
    push("stripe_endpoint_reachable", false, String(e?.name || e?.message || e));
  }

  try {
    await base44.entities.Metric.list("-created_date", 1);
    push("storage_entities", true, "entities list ok");
  } catch (e) {
    push("storage_entities", false, String(e?.message || e));
  }

  // Lightweight perf hint (no benchmark): warn if speed var missing
  const speed = getComputedStyle(document.documentElement).getPropertyValue("--igor-speed").trim();
  push("godmode_speed_var", Boolean(speed), `--igor-speed=${speed || "missing"}`);

  return report;
}

