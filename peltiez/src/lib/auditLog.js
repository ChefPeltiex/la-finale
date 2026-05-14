import { base44 } from "@/api/base44Client";

export async function auditTransaction(event) {
  const row = {
    kind: "omega_transaction",
    created_at: new Date().toISOString(),
    ...event,
  };

  try {
    await base44.entities.Transaction.create(row);
  } catch {
    // fallback: do not crash purchase flow
    try {
      const KEY = "igor:audit:fallback";
      const raw = localStorage.getItem(KEY);
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift(row);
      localStorage.setItem(KEY, JSON.stringify(arr.slice(0, 500)));
    } catch {}
  }

  return row;
}

