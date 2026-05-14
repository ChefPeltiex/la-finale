import { igor } from "@/api/igorClient";

export async function reportIncident({
  category, // fraud | pollution | harassment | spam | disinfo | other
  description,
  evidence_urls = [],
  impact = "medium", // low | medium | high | critical
  reporter_intent = "soin",
} = {}) {
  if (!category) throw new Error("reportIncident: category required");
  if (!description) throw new Error("reportIncident: description required");

  // NOTE: no personal data collection here. This is an ethical wall, not a doxx board.
  return igor.entities.IncidentReport.create({
    category,
    description,
    evidence_urls,
    impact,
    reporter_intent,
    status: "pending_review", // pending_review | confirmed | rejected
    created_at: new Date().toISOString(),
  });
}

export async function listIncidents(limit = 100) {
  return igor.entities.IncidentReport.list("-created_at", limit);
}

