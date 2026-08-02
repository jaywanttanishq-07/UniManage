import express, { type Express } from "express";
import pinoHttp from "pino-http";
import { logger } from "./lib/logger";
import router from "./routes";
import {
  helmetMiddleware,
  corsMiddleware,
  globalRateLimiter,
  bodySizeGuard,
  errorHandler,
} from "./middlewares/security";

const app: Express = express();

// ── Security headers (helmet) ─────────────────────────────────────────────────
app.use(helmetMiddleware);

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(corsMiddleware);

// ── Rate limiting (production only) ──────────────────────────────────────────
app.use(globalRateLimiter);

// ── Request logging ───────────────────────────────────────────────────────────
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          // Never log query strings — they may contain tokens or PII
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

// ── Body size guard + parsers ─────────────────────────────────────────────────
app.use(bodySizeGuard);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// ── Disable fingerprinting headers ────────────────────────────────────────────
app.disable("x-powered-by"); // belt-and-suspenders (helmet already does this)
app.disable("etag"); // prevents cache-timing side-channels

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api", router);

// ── 404 catch-all ────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// ── Centralised error handler ─────────────────────────────────────────────────
// Must be last — four-argument signature tells Express it's an error handler
app.use(errorHandler);

export default app;
