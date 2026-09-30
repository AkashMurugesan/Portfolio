import { describe, expect, it } from "vitest";
import { portfolioData } from "@/features/portfolio/data/portfolio.constants";
import { analyzeJd, compileTerm } from "./analyze";
import { tailorResume } from "./tailor";

const BACKEND_JD = `
  We are hiring a Senior Backend Engineer. You will design RESTful APIs with Node.js
  and TypeScript, work with PostgreSQL and Kafka, and deploy to AWS. Experience with
  Docker, Kubernetes and Terraform is a plus. Strong debugging and data migration skills.
`;

describe("compileTerm", () => {
  it("matches aliases on word boundaries, including symbols", () => {
    const node = compileTerm({ name: "Node.js", aliases: ["nodejs", "node"] });
    expect(node.pattern.test("experience with NodeJS")).toBe(true);
    expect(node.pattern.test("Node.js services")).toBe(true);
    expect(node.pattern.test("nodemon")).toBe(false);

    const csharp = compileTerm({ name: "C#", aliases: [".net"] });
    expect(csharp.pattern.test("C# and .NET")).toBe(true);
  });
});

describe("analyzeJd", () => {
  it("separates evidenced skills from gaps", () => {
    const { matched, missing, score } = analyzeJd(portfolioData, BACKEND_JD);
    const names = matched.map((t) => t.name);
    expect(names).toEqual(
      expect.arrayContaining([
        "Node.js",
        "TypeScript",
        "PostgreSQL",
        "Apache Kafka",
        "AWS",
      ]),
    );
    expect(missing).toEqual(
      expect.arrayContaining(["Docker", "Kubernetes", "Terraform"]),
    );
    expect(names).not.toContain("Docker");
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(100);
  });

  it("handles a JD with no recognizable terms", () => {
    expect(analyzeJd(portfolioData, "Friendly team, great coffee.")).toEqual({
      matched: [],
      missing: [],
      score: 0,
    });
  });
});

describe("tailorResume", () => {
  const { document, report } = tailorResume(portfolioData, BACKEND_JD);

  it("only uses content that exists in the portfolio", () => {
    const allBullets = new Set([
      ...portfolioData.experience.flatMap((e) => e.highlights),
      ...portfolioData.projects.flatMap((p) => p.highlights),
    ]);
    for (const bullet of [
      ...document.experience.flatMap((e) => e.bullets),
      ...document.projects.flatMap((p) => p.bullets),
    ]) {
      expect(allBullets.has(bullet)).toBe(true);
    }

    const allSkills = new Set(portfolioData.skills.flatMap((g) => g.skills));
    for (const skill of document.skills.flatMap((g) => g.items)) {
      expect(allSkills.has(skill.name)).toBe(true);
    }
  });

  it("never adds missing JD skills to the resume", () => {
    const text = JSON.stringify(document);
    for (const gap of report.missing) expect(text).not.toContain(gap);
  });

  it("keeps every role and puts the most relevant bullets first", () => {
    expect(document.experience.map((e) => e.company)).toEqual(["Comcast", "Calibraint"]);
    const calibraint = document.experience[1].bullets;
    expect(calibraint.length).toBeLessThanOrEqual(5);
    expect(calibraint[0]).toMatch(/Node\.js|Kafka|PostgreSQL|REST/);
  });

  it("marks matched skills and orders them first", () => {
    const backend = document.skills.find((g) => g.category === "Backend")!;
    expect(backend.items[0]).toEqual({ name: "Node.js", matched: true });
  });

  it("writes a summary from real facts only", () => {
    expect(document.summary).toMatch(/^Software Engineer with \d\+ years/);
    expect(document.summary).toContain("Node.js");
    expect(document.summary).not.toContain("Docker");
  });

  it("omits phone and address when they are not in the profile", () => {
    expect(document.contact).toContain("akashmurugesan21@gmail.com");
    expect(document.contact.some((c) => /\+91|Thanjavur/.test(c))).toBe(false);
  });
});
