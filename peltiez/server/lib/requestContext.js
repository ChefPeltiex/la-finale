import crypto from "crypto";

function safeId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `req_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }
}

/**
 * Ajoute un request-id stable et le renvoie au client.
 * @returns {import("express").RequestHandler}
 */
export function withRequestId() {
  return (req, res, next) => {
    const incoming = req.headers["x-request-id"];
    const id = typeof incoming === "string" && incoming.trim() ? incoming.trim() : safeId();
    req.requestId = id;
    res.setHeader("x-request-id", id);
    next();
  };
}

/**
 * Logger JSON minimal: stdout. (Pour prod: brancher pino/winston + transport.)
 */
export function logRequests() {
  return (req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      const ms = Date.now() - start;
      // Ne jamais logguer de secrets; logguer le minimum utile.
      const line = {
        t: new Date().toISOString(),
        level: "info",
        msg: "http_request",
        requestId: req.requestId,
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        ms,
        ip: req.ip,
      };
       
      console.log(JSON.stringify(line));
    });
    next();
  };
}

/**
 * Capture erreurs Express en JSON + requestId.
 * @param {boolean} isProd
 */
export function errorHandler(isProd) {
   
  return (err, req, res, next) => {
    const status = Number(err?.statusCode || err?.status || 500);
    const code = err?.code || "internal_error";
    if (!isProd) {
       
      console.error("[server:error]", req.requestId, err);
    }
    res.status(status).json({
      error: code,
      requestId: req.requestId,
    });
  };
}

