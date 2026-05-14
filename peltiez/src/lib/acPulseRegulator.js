/**
 * Cooperative async scheduling helpers (“AC-like” duty framing): short yields so the
 * runtime can paint and dispatch input. DEFAULT_DUTY is the nominal fraction of time
 * spent in active work versus yielding when you interleave work with these pauses —
 * a UX / event-loop hygiene knob only, not an energy or emissions metric.
 */

export const DEFAULT_DUTY = 0.85;

export function microYield(ms = 150) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function yieldIfPossible(preferredMs = 150) {
  if (typeof requestIdleCallback === "function") {
    return new Promise((resolve) => {
      requestIdleCallback(() => resolve(), { timeout: preferredMs });
    });
  }
  return microYield(preferredMs);
}

export async function processWithCooling(task, opts = {}) {
  const { pauseMs = 150, useIdleCallback = false } = opts;
  try {
    await task();
  } finally {
    if (useIdleCallback) {
      await yieldIfPossible(pauseMs);
    } else {
      await microYield(pauseMs);
    }
  }
}

export async function runBatched(items, worker, opts = {}) {
  let { batchSize = 10, pauseBetweenBatchesMs = 150 } = opts;
  if (!Number.isFinite(batchSize) || batchSize < 1) batchSize = 10;
  batchSize = Math.floor(batchSize);
  const list = Array.isArray(items) ? items : Array.from(items);
  for (let i = 0; i < list.length; i += batchSize) {
    const end = Math.min(i + batchSize, list.length);
    for (let j = i; j < end; j += 1) {
      await worker(list[j], j);
    }
    if (end < list.length) {
      await microYield(pauseBetweenBatchesMs);
    }
  }
}

// Optional integration: graph/layout passes over large entry sets in
// `src/pages/BibleGraph.jsx` are a natural place to chunk work with `runBatched`
// or to insert `yieldIfPossible` between batches if profiling shows main-thread jank.
