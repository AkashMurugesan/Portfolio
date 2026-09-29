// Applies pending migrations from ./drizzle to the configured database.
// Usage: npm run db:migrate  (uses DATABASE_URL, or local PGlite if unset)
import { createDb, targetFromEnv } from "./client";

async function main() {
  const target = targetFromEnv();
  const { migrate, close } = createDb(target);
  console.log(
    `Migrating ${target.kind === "postgres" ? "Postgres (DATABASE_URL)" : `PGlite (${target.dataDir})`}...`,
  );
  await migrate();
  await close();
  console.log("Migrations applied.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
