/** Fenêtre glissante minimaliste — mémoire process ; pour prod forte préférer CDN/WAF. */

const buckets = new Map();

/**
 * @param {{ windowMs?: number; max?: number; name?: string }} opts
 */
export function rateLimitWindow(opts = {}) {
  const windowMs = opts.windowMs ?? 60_000;
  const max = opts.max ?? 120;
  const name = opts.name ?? "rl";

  return function rateLimitMiddleware(req, res, next) {
    const ip = req.ip || req.socket?.remoteAddress || "unknown";
    const key = `${name}:${ip}`;
    const now = Date.now();
    let b = buckets.get(key);
    if (!b || now > b.resetAt) {
      b = { count: 0, resetAt: now + windowMs };
      buckets.set(key, b);
    }
    b.count += 1;
    if (b.count > max) {
      res.setHeader("Retry-After", String(Math.ceil((b.resetAt - now) / 1000)));
      return res.status(429).json({ error: "too_many_requests" });
    }
    next();
  };
}
