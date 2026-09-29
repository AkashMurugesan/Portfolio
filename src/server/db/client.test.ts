import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createDb, targetFromEnv, type DbHandle } from "./client";
import { profile } from "./schema";

const env = (vars: Record<string, string>) => vars as unknown as NodeJS.ProcessEnv;

describe("targetFromEnv", () => {
  it("uses Postgres when DATABASE_URL is set", () => {
    expect(targetFromEnv(env({ DATABASE_URL: "postgres://x" }))).toEqual({
      kind: "postgres",
      url: "postgres://x",
    });
  });

  it("falls back to local PGlite", () => {
    expect(targetFromEnv(env({}))).toEqual({
      kind: "pglite",
      dataDir: "./.data/pglite",
    });
  });
});

describe("migrations (in-memory PGlite)", () => {
  let handle: DbHandle;

  beforeAll(async () => {
    handle = createDb({ kind: "pglite" });
    await handle.migrate();
  });

  afterAll(async () => {
    await handle.close();
  });

  it("creates the profile table with defaults", async () => {
    const [row] = await handle.db
      .insert(profile)
      .values({ name: "Test Person", headline: "Engineer" })
      .returning();

    expect(row.id).toBe(1);
    expect(row.links).toEqual([]);
    expect(row.createdAt).toBeInstanceOf(Date);
  });

  it("enforces the profile singleton", async () => {
    await expect(
      handle.db.insert(profile).values({ id: 2, name: "Other", headline: "x" }),
    ).rejects.toThrow();
  });
});
