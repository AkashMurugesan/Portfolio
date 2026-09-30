/**
 * Portfolio domain model. The UI depends only on these types — never on where
 * the data comes from (constants today, database/API later).
 */

/** ISO year-month, e.g. "2021-04". */
export type YearMonth = string;

export type Link = { label: string; url: string };

export type Profile = {
  name: string;
  headline: string;
  /** One-line positioning shown in the hero. */
  tagline: string;
  about: string[];
  location: string;
  email: string;
  phone?: string;
  links: Link[];
  /** What I'm focused on / exploring right now. */
  currentFocus: string[];
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  location: string;
  start: YearMonth;
  /** Undefined = present. */
  end?: YearMonth;
  summary: string;
  highlights: string[];
  tech: string[];
  /** Ids of projects delivered in this role. */
  projectIds: string[];
};

export type Project = {
  id: string;
  name: string;
  tagline: string;
  /** Company the project was built at, if any. */
  experienceId?: string;
  tech: string[];
  highlights: string[];
  featured: boolean;
};

export type SkillGroup = {
  id: string;
  category: string;
  skills: string[];
};

export type Achievement = {
  id: string;
  title: string;
  /** Year or free text, e.g. "2025" or "Multiple times". */
  date: string;
  description: string;
};

export type Education = {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  start: YearMonth;
  end: YearMonth;
  grade?: string;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
};

/** Admin-defined section for content that has no dedicated component yet. */
export type CustomSection = {
  id: string;
  title: string;
  items: { id: string; title: string; subtitle: string; body: string }[];
};

export type Portfolio = {
  profile: Profile;
  experience: Experience[];
  projects: Project[];
  skills: SkillGroup[];
  achievements: Achievement[];
  education: Education[];
  certifications: Certification[];
  customSections: CustomSection[];
};

/** Collections that support generic add / edit / delete. */
export type CollectionKey = Exclude<keyof Portfolio, "profile">;
export type CollectionItem<K extends CollectionKey> = Portfolio[K][number];
