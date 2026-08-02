import helmet from "helmet";
import rateLimit from "express-rate-limit";
import type { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger";

const isProduction = process.env.NODE_ENV === "production";

// ── Helmet: security headers ──────────────────────────────────────────────────
// Sets X-DNS-Prefetch-Control, X-Frame-Options, X-Content-Type-Options,
// Referrer-Policy, X-Permitted-Cross-Domain-Policies, and a strict CSP.
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  // Prevent clickjacking
  frameguard: { action: "deny" },
  // Prevent MIME sniffing
  noSniff: true,
  // Force HTTPS in production
  hsts: isProduction
    ? { maxAge: 31536000, includeSubDomains: true, preload: true }
    : false,
  // Hide that we're using Express
  hidePoweredBy: true,
});

// ── CORS ──────────────────────────────────────────────────────────────────────
// Only allow requests from the frontend origin (or env-configured list).
// Falls back to development-safe defaults if ALLOWED_ORIGINS is unset.
const rawOrigins = process.env.ALLOWED_ORIGINS ?? "";
const allowedOrigins: Set<string> = new Set(
  rawOrigins
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
);

export function corsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const origin = req.headers.origin;

  if (!isProduction) {
    // In dev, reflect the requesting origin but log it
    if (origin) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Vary", "Origin");
    }
  } else if (origin && allowedOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  } else if (origin) {
    logger.warn({ origin }, "CORS: blocked request from unlisted origin");
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Request-ID",
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "600");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  next();
}

// ── Rate limiting ─────────────────────────────────────────────────────────────
// Global: 200 requests per 15 min per IP — prevents brute-force / scraping
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many requests — please slow down." },
  skip: () => !isProduction, // only enforce in production
});

// Strict limiter for sensitive / write endpoints
export const strictRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many requests to this endpoint." },
});

// ── Request size guard ────────────────────────────────────────────────────────
// Refuse bodies larger than 1 MB to block DoS via giant payloads.
// Express's built-in json/urlencoded parsers already have a `limit` option,
// but this middleware adds an explicit check before parsing.
export function bodySizeGuard(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const contentLength = parseInt(req.headers["content-length"] ?? "0", 10);
  const MAX_BYTES = 1_048_576; // 1 MB

  if (contentLength > MAX_BYTES) {
    res.status(413).json({ error: "Request entity too large." });
    return;
  }
  next();
}

// ── Safe error handler ────────────────────────────────────────────────────────
// Never leak stack traces or internal messages to the client in production.
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  const statusCode =
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    typeof (err as { status: unknown }).status === "number"
      ? (err as { status: number }).status
      : 500;

  logger.error(
    { err, method: req.method, url: req.url?.split("?")[0] },
    "Unhandled error",
  );

  if (isProduction) {
    // Reveal nothing internal in production
    res.status(statusCode).json({
      error:
        statusCode < 500
          ? (err as { message?: string }).message ?? "Bad request"
          : "Internal server error",
    });
  } else {
    // In development, include the stack for easier debugging
    res.status(statusCode).json({
      error:
        err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
  }
}
