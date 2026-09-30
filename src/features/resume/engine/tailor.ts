import {
  formatRange,
  formatYearMonth,
  yearsOfExperience,
} from "@/features/portfolio/model/derive";
import type { Portfolio } from "@/features/portfolio/model/types";
import { analyzeJd, relevance, type CompiledTerm } from "./analyze";
import type {
  ResumeDocument,
  ResumeTailor,
  TailorOptions,
  TailoredResume,
} from "./types";

const DEFAULTS: Required<TailorOptions> = {
  maxBulletsCurrentRole: 6,
  maxBulletsPastRole: 5,
  maxProjects: 4,
};

/** Stable sort by relevance (desc); ties keep the author's original order. */
function rankByRelevance<T>(
  items: T[],
  text: (item: T) => string,
  terms: CompiledTerm[],
) {
  return items
    .map((item, index) => ({ item, index, score: relevance(text(item), terms) }))
    .sort((a, b) => b.score - a.score || a.index - b.index);
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}

function buildSummary(portfolio: Portfolio, matched: CompiledTerm[]): string {
  const title = portfolio.profile.headline.split(/[·|]/)[0].trim();
  const years = yearsOfExperience(portfolio);
  const techNames = new Set(
    [...portfolio.skills.flatMap((g) => g.skills)].map((s) => s.toLowerCase()),
  );
  // Prefer matched technologies that are listed skills; fall back to top skills.
  const focus = matched.map((t) => t.name).filter((n) => techNames.has(n.toLowerCase()));
  const stack =
    focus.length > 0
      ? focus.slice(0, 6)
      : portfolio.skills.flatMap((g) => g.skills).slice(0, 6);
  const practices = matched
    .map((t) => t.name)
    .filter((n) => !techNames.has(n.toLowerCase()))
    .slice(0, 4);

  let summary = `${title} with ${years}+ years of experience building and supporting backend and full-stack applications using ${joinList(stack)}.`;
  if (practices.length > 0) {
    summary += ` Hands-on experience with ${joinList(practices)}.`;
  }
  return summary;
}

/** Selects and reorders real portfolio content for a JD. Never writes new claims. */
export function tailorResume(
  portfolio: Portfolio,
  jd: string,
  options: TailorOptions = {},
): TailoredResume {
  const opts = { ...DEFAULTS, ...options };
  const analysis = analyzeJd(portfolio, jd);
  const terms = analysis.matched;
  const isMatched = (name: string) => terms.some((t) => t.pattern.test(name));
  const { profile } = portfolio;

  const skills = portfolio.skills
    .map((group) => {
      const items = rankByRelevance(group.skills, (s) => s, terms).map(({ item }) => ({
        name: item,
        matched: isMatched(item),
      }));
      return {
        category: group.category,
        items,
        hits: items.filter((i) => i.matched).length,
      };
    })
    .sort((a, b) => b.hits - a.hits)
    .map(({ category, items }) => ({ category, items }));

  // Every role stays (no gaps in history); only bullet order and count change.
  const experience = portfolio.experience.map((role) => ({
    company: role.company,
    role: role.role,
    location: role.location,
    dates: formatRange(role.start, role.end),
    bullets: rankByRelevance(role.highlights, (h) => h, terms)
      .slice(0, role.end ? opts.maxBulletsPastRole : opts.maxBulletsCurrentRole)
      .map(({ item }) => item),
  }));

  const projects = rankByRelevance(
    portfolio.projects,
    (p) => [p.name, p.tagline, ...p.tech, ...p.highlights].join("\n"),
    terms,
  )
    .sort((a, b) =>
      terms.length === 0 ? Number(b.item.featured) - Number(a.item.featured) : 0,
    )
    .slice(0, opts.maxProjects)
    .map(({ item }) => ({
      name: item.name,
      tech: item.tech,
      bullets: rankByRelevance(item.highlights, (h) => h, terms)
        .slice(0, 3)
        .map((r) => r.item),
    }));

  const document: ResumeDocument = {
    name: profile.name,
    headline: profile.headline,
    contact: [
      profile.email,
      profile.phone,
      profile.location,
      ...profile.links.map((l) => l.url.replace(/^https?:\/\//, "")),
    ].filter((c): c is string => Boolean(c)),
    summary: buildSummary(portfolio, terms),
    skills,
    experience,
    projects,
    achievements: portfolio.achievements.map((a) =>
      /^\d{4}$/.test(a.date) ? `${a.title} — ${a.date}` : `${a.title} — ${a.description}`,
    ),
    education: portfolio.education.map((e) => ({
      title: `${e.degree}, ${e.field} — ${e.institution}`,
      detail: [
        e.location,
        `${formatYearMonth(e.start)} – ${formatYearMonth(e.end)}`,
        e.grade,
      ]
        .filter(Boolean)
        .join(" | "),
    })),
    certifications: portfolio.certifications.map((c) =>
      [c.name, c.issuer, c.date].filter(Boolean).join(" — "),
    ),
  };

  return {
    document,
    report: {
      score: analysis.score,
      matched: terms.map((t) => t.name),
      missing: analysis.missing,
    },
  };
}

export const keywordTailor: ResumeTailor = {
  async tailor(portfolio, jd, options) {
    return tailorResume(portfolio, jd, options);
  },
};
