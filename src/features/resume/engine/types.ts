import type { Portfolio } from "@/features/portfolio/model/types";

/** Renderer-agnostic resume. Every line is taken from the portfolio. */
export type ResumeDocument = {
  name: string;
  headline: string;
  contact: string[];
  summary: string;
  skills: { category: string; items: { name: string; matched: boolean }[] }[];
  experience: {
    company: string;
    role: string;
    location: string;
    dates: string;
    bullets: string[];
  }[];
  projects: { name: string; tech: string[]; bullets: string[] }[];
  achievements: string[];
  education: { title: string; detail: string }[];
  certifications: string[];
};

export type MatchReport = {
  score: number;
  matched: string[];
  missing: string[];
};

export type TailoredResume = {
  document: ResumeDocument;
  report: MatchReport;
};

export type TailorOptions = {
  maxBulletsCurrentRole?: number;
  maxBulletsPastRole?: number;
  maxProjects?: number;
};

/**
 * Tailoring strategy. Today: deterministic keyword matching.
 * Later: an LLM-backed implementation can plug in behind the same interface.
 */
export interface ResumeTailor {
  tailor(
    portfolio: Portfolio,
    jd: string,
    options?: TailorOptions,
  ): Promise<TailoredResume>;
}
