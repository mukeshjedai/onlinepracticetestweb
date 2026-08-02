import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __acpPool: Pool | undefined;
}

function createPool() {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error("DATABASE_URL is not configured");
  }

  // Aiven uses a certificate chain Node doesn't trust by default.
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  const connectionString = raw
    .replace(/[?&]sslmode=[^&]*/g, "")
    .replace(/\?&/, "?")
    .replace(/\?$/, "");

  return new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 5,
  });
}

export function getPool() {
  if (!global.__acpPool) {
    global.__acpPool = createPool();
  }
  return global.__acpPool;
}
