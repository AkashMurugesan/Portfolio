import type { Portfolio } from "../../model/types";

export type SectionDef = {
  id: string;
  label: string;
  group: "portfolio" | "custom" | "tools";
  count?: number;
};

export const RESUME_SECTION = "resume";

/** Sidebar entries. Custom sections are appended from data. */
export function buildSections(portfolio: Portfolio, isAdmin: boolean): SectionDef[] {
  const hasEducation =
    portfolio.education.length > 0 || portfolio.certifications.length > 0 || isAdmin;
  return [
    { id: "overview", label: "Overview", group: "portfolio" },
    {
      id: "experience",
      label: "Experience",
      group: "portfolio",
      count: portfolio.experience.length,
    },
    {
      id: "projects",
      label: "Projects",
      group: "portfolio",
      count: portfolio.projects.length,
    },
    {
      id: "skills",
      label: "Skills",
      group: "portfolio",
      count: portfolio.skills.reduce((n, g) => n + g.skills.length, 0),
    },
    { id: "journey", label: "Career Journey", group: "portfolio" },
    {
      id: "achievements",
      label: "Achievements",
      group: "portfolio",
      count: portfolio.achievements.length,
    },
    ...(hasEducation
      ? [{ id: "education", label: "Education & Certs", group: "portfolio" as const }]
      : []),
    ...portfolio.customSections
      .filter((s) => isAdmin || s.items.length > 0)
      .map((s) => ({
        id: `custom-${s.id}`,
        label: s.title,
        group: "custom" as const,
        count: s.items.length,
      })),
    { id: RESUME_SECTION, label: "Resume Generator", group: "tools" },
  ];
}
