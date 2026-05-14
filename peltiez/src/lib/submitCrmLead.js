/**
 * Envoie un lead vers `/api/crm/lead` avec attribution (UTM + chemin courant).
 */
export async function submitCrmLead(payload) {
  const search = typeof window !== "undefined" ? window.location.search : "";
  const params = new URLSearchParams(search);
  const utm_source = params.get("utm_source") || undefined;
  const utm_medium = params.get("utm_medium") || undefined;
  const utm_campaign = params.get("utm_campaign") || undefined;
  const page_path = typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : undefined;

  const res = await fetch("/api/crm/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      ...payload,
      utm_source,
      utm_medium,
      utm_campaign,
      page_path,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}
