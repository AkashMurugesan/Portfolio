import { pgEnum, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Visibility of a content item.
 * - draft:    work in progress, admin only
 * - private:  finished but never shown publicly
 * - unlisted: public only when accessed by exact slug (not listed anywhere)
 * - public:   listed and visible to everyone
 */
export const visibility = pgEnum("visibility", [
  "draft",
  "private",
  "unlisted",
  "public",
]);

export type Visibility = (typeof visibility.enumValues)[number];

export const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

/** Columns shared by every publishable content entity. */
export const contentColumns = {
  visibility: visibility("visibility").notNull().default("draft"),
  // Never selected by the public data-access layer.
  privateNotes: text("private_notes"),
  ...timestamps,
};
