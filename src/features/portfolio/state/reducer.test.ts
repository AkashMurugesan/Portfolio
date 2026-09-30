import { describe, expect, it } from "vitest";
import { portfolioData } from "../data/portfolio.constants";
import { portfolioReducer } from "./reducer";

const base = structuredClone(portfolioData);

describe("portfolioReducer", () => {
  it("updates the profile without touching other fields", () => {
    const next = portfolioReducer(base, {
      type: "profile/update",
      patch: { tagline: "New tagline" },
    });
    expect(next.profile.tagline).toBe("New tagline");
    expect(next.profile.name).toBe(base.profile.name);
    expect(base.profile.tagline).not.toBe("New tagline"); // immutable
  });

  it("adds a new item and edits an existing one", () => {
    const added = portfolioReducer(base, {
      type: "collection/upsert",
      collection: "certifications",
      item: { id: "c1", name: "AWS SAA", issuer: "AWS", date: "2026" },
    });
    expect(added.certifications).toHaveLength(1);

    const edited = portfolioReducer(added, {
      type: "collection/upsert",
      collection: "certifications",
      item: { id: "c1", name: "AWS SAA-C03", issuer: "AWS", date: "2026" },
    });
    expect(edited.certifications).toEqual([
      { id: "c1", name: "AWS SAA-C03", issuer: "AWS", date: "2026" },
    ]);
  });

  it("removing a project also removes it from roles", () => {
    const next = portfolioReducer(base, {
      type: "collection/remove",
      collection: "projects",
      id: "catman",
    });
    expect(next.projects.some((p) => p.id === "catman")).toBe(false);
    expect(next.experience.find((e) => e.id === "comcast")!.projectIds).toEqual(["iris"]);
  });

  it("removing a role unlinks its projects", () => {
    const next = portfolioReducer(base, {
      type: "collection/remove",
      collection: "experience",
      id: "comcast",
    });
    expect(next.projects.find((p) => p.id === "iris")!.experienceId).toBeUndefined();
  });

  it("reorders within bounds", () => {
    const moved = portfolioReducer(base, {
      type: "collection/move",
      collection: "experience",
      id: "calibraint",
      offset: -1,
    });
    expect(moved.experience.map((e) => e.id)).toEqual(["calibraint", "comcast"]);
    const unchanged = portfolioReducer(moved, {
      type: "collection/move",
      collection: "experience",
      id: "calibraint",
      offset: -1,
    });
    expect(unchanged).toBe(moved);
  });
});
