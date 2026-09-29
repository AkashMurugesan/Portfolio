import { integer, jsonb, pgTable, text, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { timestamps } from "./common";

export type ProfileLink = { label: string; url: string };

/** Singleton row (id is always 1) holding the public identity. */
export const profile = pgTable(
  "profile",
  {
    id: integer("id").primaryKey().default(1),
    name: text("name").notNull(),
    headline: text("headline").notNull(),
    summary: text("summary").notNull().default(""),
    location: text("location"),
    email: text("email"),
    links: jsonb("links").$type<ProfileLink[]>().notNull().default([]),
    resumeUrl: text("resume_url"),
    ...timestamps,
  },
  (t) => [check("profile_singleton", sql`${t.id} = 1`)],
);
