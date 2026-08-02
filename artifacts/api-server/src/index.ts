import app from "./app";
import { logger } from "./lib/logger";

// Default to 3001 in local/VS Code dev — PORT is set automatically on Replit
const rawPort = process.env["PORT"] ?? "3001";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port, env: process.env.NODE_ENV ?? "development" }, "Server listening");
});
