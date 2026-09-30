import type { Portfolio } from "@/features/portfolio/model/types";
import { KNOWN_TERMS, type Term } from "./terms";

export type CompiledTerm = { name: string; pattern: RegExp };

export type JdAnalysis = {
  /** JD terms the portfolio can back up with real evidence. */
  matched: CompiledTerm[];
  /** JD terms with no evidence in the portfolio (shown to the user, never added). */
  missing: string[];
  /** matched / (matched + missing), 0–100. */
  score: number;
};

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

/** Case-insensitive match that treats letters/digits as word characters (so "c#", "node.js" work). */
export function compileTerm(term: Term): CompiledTerm {
  const alternatives = [...new Set([term.name.toLowerCase(), ...term.aliases])]
    .sort((a, b) => b.length - a.length)
    .map(escape)
    .join("|");
  return {
    name: term.name,
    pattern: new RegExp(`(?<![a-z0-9])(?:${alternatives})(?![a-z0-9])`, "i"),
  };
}

/** All technologies and skills named anywhere in the portfolio. */
export function portfolioTechNames(portfolio: Portfolio): string[] {
  return [
    ...portfolio.skills.flatMap((g) => g.skills),
    ...portfolio.projects.flatMap((p) => p.tech),
    ...portfolio.experience.flatMap((e) => e.tech),
  ];
}

/** Everything the portfolio says, as one searchable string. */
export function portfolioCorpus(portfolio: Portfolio): string {
  return [
    portfolio.profile.headline,
    ...portfolio.profile.about,
    ...portfolioTechNames(portfolio),
    ...portfolio.experience.flatMap((e) => [e.role, e.summary, ...e.highlights]),
    ...portfolio.projects.flatMap((p) => [p.tagline, ...p.highlights]),
  ].join("\n");
}

/** Known terms plus any portfolio tech the dictionary doesn't know yet. */
export function vocabulary(portfolio: Portfolio): CompiledTerm[] {
  const known = new Set(KNOWN_TERMS.flatMap((t) => [t.name.toLowerCase(), ...t.aliases]));
  const extra: Term[] = [...new Set(portfolioTechNames(portfolio))]
    .filter((name) => !known.has(name.toLowerCase()))
    .map((name) => ({ name, aliases: [] }));
  return [...KNOWN_TERMS, ...extra].map(compileTerm);
}

export function analyzeJd(portfolio: Portfolio, jd: string): JdAnalysis {
  const corpus = portfolioCorpus(portfolio);
  const requested = vocabulary(portfolio).filter((t) => t.pattern.test(jd));
  const matched = requested.filter((t) => t.pattern.test(corpus));
  const missing = requested.filter((t) => !t.pattern.test(corpus)).map((t) => t.name);
  const total = matched.length + missing.length;
  return {
    matched,
    missing,
    score: total === 0 ? 0 : Math.round((matched.length / total) * 100),
  };
}

/** Number of matched JD terms mentioned in `text`. */
export function relevance(text: string, terms: CompiledTerm[]): number {
  return terms.reduce((n, t) => n + (t.pattern.test(text) ? 1 : 0), 0);
}
