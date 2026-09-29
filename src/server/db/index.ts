import "server-only";
import { createDb, targetFromEnv, type DbHandle } from "./client";

// Reuse one connection across dev hot reloads (PGlite allows a single
// process per data directory).
const globalForDb = globalThis as unknown as { dbHandle?: DbHandle };

const handle = globalForDb.dbHandle ?? createDb(targetFromEnv());
if (process.env.NODE_ENV !== "production") globalForDb.dbHandle = handle;

export const db = handle.db;
export type { Db } from "./client";
