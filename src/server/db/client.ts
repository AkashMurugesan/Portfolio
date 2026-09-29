import { mkdirSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { migrate as migratePglite } from "drizzle-orm/pglite/migrator";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import { migrate as migratePostgres } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "./schema";

export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

export const MIGRATIONS_FOLDER = "./drizzle";

export type DbTarget =
  // A real Postgres server (Neon, VPS, docker compose).
  | { kind: "postgres"; url: string }
  // Embedded Postgres (WASM). `dataDir` omitted => in-memory (tests).
  | { kind: "pglite"; dataDir?: string };

export type DbHandle = {
  db: Db;
  migrate: () => Promise<void>;
  close: () => Promise<void>;
};

/** Resolves the database target from the environment. */
export function targetFromEnv(env: NodeJS.ProcessEnv = process.env): DbTarget {
  if (env.DATABASE_URL) return { kind: "postgres", url: env.DATABASE_URL };
  return { kind: "pglite", dataDir: env.PGLITE_DIR ?? "./.data/pglite" };
}

/**
 * Creates a Drizzle database for the given target. Kept free of Next.js
 * imports so scripts and tests can use it directly.
 */
export function createDb(target: DbTarget): DbHandle {
  if (target.kind === "postgres") {
    const client = postgres(target.url, { max: 5 });
    const db = drizzlePostgres(client, { schema });
    return {
      db: db as unknown as Db,
      migrate: () => migratePostgres(db, { migrationsFolder: MIGRATIONS_FOLDER }),
      close: () => client.end(),
    };
  }

  // PGlite does not create missing parent directories.
  if (target.dataDir) mkdirSync(target.dataDir, { recursive: true });
  const client = new PGlite(target.dataDir);
  const db = drizzlePglite(client, { schema });
  return {
    db: db as unknown as Db,
    migrate: () => migratePglite(db, { migrationsFolder: MIGRATIONS_FOLDER }),
    close: () => client.close(),
  };
}
