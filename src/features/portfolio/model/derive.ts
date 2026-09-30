import type { Portfolio, YearMonth } from "./types";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatYearMonth(value: YearMonth | undefined): string {
  if (!value) return "Present";
  const [year, month] = value.split("-").map(Number);
  if (!year || !month) return value;
  return `${MONTHS[month - 1]} ${year}`;
}

export function formatRange(start: YearMonth, end?: YearMonth): string {
  return `${formatYearMonth(start)} – ${formatYearMonth(end)}`;
}

function toMonthIndex(value: YearMonth): number {
  const [year, month] = value.split("-").map(Number);
  return year * 12 + (month - 1);
}

function currentYearMonth(now: Date): YearMonth {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

/** Duration like "3 yrs 8 mos". */
export function formatDuration(
  start: YearMonth,
  end?: YearMonth,
  now = new Date(),
): string {
  const months = toMonthIndex(end ?? currentYearMonth(now)) - toMonthIndex(start) + 1;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts = [];
  if (years) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (rest) parts.push(`${rest} mo${rest > 1 ? "s" : ""}`);
  return parts.join(" ") || "1 mo";
}

/** Whole years of professional experience, from the earliest role start. */
export function yearsOfExperience(portfolio: Portfolio, now = new Date()): number {
  if (portfolio.experience.length === 0) return 0;
  const earliest = Math.min(...portfolio.experience.map((e) => toMonthIndex(e.start)));
  return Math.floor((toMonthIndex(currentYearMonth(now)) - earliest) / 12);
}

export type TechEvidence = {
  tech: string;
  projects: { id: string; name: string }[];
  roles: { id: string; label: string }[];
  /** Total places this technology was actually used. */
  count: number;
};

/**
 * How often each technology appears in real work. Skill depth is derived from
 * evidence (projects + roles), never self-rated.
 */
export function techEvidence(portfolio: Portfolio): Map<string, TechEvidence> {
  const map = new Map<string, TechEvidence>();
  const entry = (tech: string) => {
    const key = tech.toLowerCase();
    let value = map.get(key);
    if (!value) {
      value = { tech, projects: [], roles: [], count: 0 };
      map.set(key, value);
    }
    return value;
  };
  for (const project of portfolio.projects) {
    for (const tech of project.tech) {
      const e = entry(tech);
      e.projects.push({ id: project.id, name: project.name });
      e.count++;
    }
  }
  for (const role of portfolio.experience) {
    for (const tech of role.tech) {
      const e = entry(tech);
      e.roles.push({ id: role.id, label: `${role.role} · ${role.company}` });
      e.count++;
    }
  }
  return map;
}

export type JourneyEvent = {
  id: string;
  date: YearMonth | string;
  sortKey: number;
  kind: "education" | "role" | "achievement" | "certification";
  title: string;
  detail: string;
};

/** Career journey assembled from existing records — nothing is stored twice. */
export function journey(portfolio: Portfolio): JourneyEvent[] {
  const events: JourneyEvent[] = [];
  for (const ed of portfolio.education) {
    events.push({
      id: `ed-start-${ed.id}`,
      date: ed.start,
      sortKey: toMonthIndex(ed.start),
      kind: "education",
      title: `Started ${ed.degree} ${ed.field}`,
      detail: ed.institution,
    });
    events.push({
      id: `ed-end-${ed.id}`,
      date: ed.end,
      sortKey: toMonthIndex(ed.end),
      kind: "education",
      title: `Graduated — ${ed.degree}`,
      detail: [ed.institution, ed.grade].filter(Boolean).join(" · "),
    });
  }
  for (const role of portfolio.experience) {
    events.push({
      id: `role-${role.id}`,
      date: role.start,
      sortKey: toMonthIndex(role.start),
      kind: "role",
      title: `Joined ${role.company} as ${role.role}`,
      detail: role.summary,
    });
  }
  for (const a of portfolio.achievements) {
    const year = Number(a.date);
    if (!Number.isInteger(year)) continue; // undated achievements stay off the timeline
    events.push({
      id: `ach-${a.id}`,
      date: a.date,
      sortKey: year * 12 + 11,
      kind: "achievement",
      title: a.title,
      detail: a.description,
    });
  }
  return events.sort((a, b) => a.sortKey - b.sortKey);
}
