import { igor } from "@/api/igorClient";

/**
 * Seed cycle: "fade" an idea/module and archive it.
 * This is not file-moving; it's living memory that feeds next generations.
 */
export async function fadeToArchive({
  kind = "module", // module | idea | feature
  id,
  name,
  reason,
  snapshot = {},
  lineage = [],
  tags = [],
} = {}) {
  if (!id || !name) throw new Error("fadeToArchive: id and name are required");
  if (!reason) throw new Error("fadeToArchive: reason is required");

  const archived = await igor.entities.Archive.create({
    kind,
    ref_id: id,
    name,
    reason,
    lineage,
    tags,
    snapshot,
    archived_at: new Date().toISOString(),
  });

  return archived;
}

export async function listArchive(limit = 100) {
  return igor.entities.Archive.list("-archived_at", limit);
}

