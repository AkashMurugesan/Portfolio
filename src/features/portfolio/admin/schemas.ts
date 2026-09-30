import type { CollectionKey, Portfolio } from "../model/types";
import type { Field } from "./fields";

export const profileFields: Field[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "headline", label: "Headline", type: "text", required: true },
  {
    name: "tagline",
    label: "Tagline",
    type: "textarea",
    hint: "One-line positioning in the hero.",
  },
  { name: "about", label: "About", type: "list", hint: "One paragraph per line." },
  { name: "location", label: "Location", type: "text" },
  { name: "email", label: "Email", type: "email" },
  {
    name: "phone",
    label: "Phone",
    type: "text",
    hint: "Optional. Leave empty to keep it off the public site and resumes.",
  },
  {
    name: "links",
    label: "Links",
    type: "links",
    hint: "One per line: Label | https://url",
  },
  {
    name: "currentFocus",
    label: "Current focus",
    type: "list",
    hint: "One item per line.",
  },
];

/** Field definitions per collection. Options depend on current data. */
export function collectionFields(
  collection: CollectionKey,
  portfolio: Portfolio,
): Field[] {
  switch (collection) {
    case "experience":
      return [
        { name: "company", label: "Company", type: "text", required: true },
        { name: "role", label: "Role / title", type: "text", required: true },
        { name: "location", label: "Location", type: "text" },
        { name: "start", label: "Start", type: "month", required: true },
        { name: "end", label: "End", type: "month", hint: "Leave empty if current." },
        { name: "summary", label: "Summary", type: "textarea" },
        {
          name: "highlights",
          label: "Highlights",
          type: "list",
          hint: "One bullet per line.",
        },
        { name: "tech", label: "Technologies", type: "tags", hint: "Comma separated." },
        {
          name: "projectIds",
          label: "Projects in this role",
          type: "multiselect",
          options: portfolio.projects.map((p) => ({ value: p.id, label: p.name })),
        },
      ];
    case "projects":
      return [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "tagline", label: "Tagline", type: "text" },
        {
          name: "experienceId",
          label: "Built at",
          type: "select",
          options: [
            { value: "", label: "— Personal / other —" },
            ...portfolio.experience.map((e) => ({ value: e.id, label: e.company })),
          ],
        },
        { name: "tech", label: "Technologies", type: "tags", hint: "Comma separated." },
        {
          name: "highlights",
          label: "Highlights",
          type: "list",
          hint: "One bullet per line.",
        },
        { name: "featured", label: "Featured project", type: "checkbox" },
      ];
    case "skills":
      return [
        { name: "category", label: "Category", type: "text", required: true },
        { name: "skills", label: "Skills", type: "tags", hint: "Comma separated." },
      ];
    case "achievements":
      return [
        { name: "title", label: "Title", type: "text", required: true },
        {
          name: "date",
          label: "Date",
          type: "text",
          hint: "e.g. 2025 or “Multiple times”.",
        },
        { name: "description", label: "Description", type: "textarea" },
      ];
    case "education":
      return [
        { name: "institution", label: "Institution", type: "text", required: true },
        { name: "degree", label: "Degree", type: "text", required: true },
        { name: "field", label: "Field of study", type: "text" },
        { name: "location", label: "Location", type: "text" },
        { name: "start", label: "Start", type: "month", required: true },
        { name: "end", label: "End", type: "month", required: true },
        { name: "grade", label: "Grade", type: "text" },
      ];
    case "certifications":
      return [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "issuer", label: "Issuer", type: "text" },
        { name: "date", label: "Date", type: "text" },
        { name: "url", label: "Credential URL", type: "url" },
      ];
    case "customSections":
      return [{ name: "title", label: "Section title", type: "text", required: true }];
  }
}

/** Empty item used by "Add". */
export function blankItem(
  collection: CollectionKey,
  id: string,
): Record<string, unknown> {
  const blanks: Record<CollectionKey, Record<string, unknown>> = {
    experience: { summary: "", highlights: [], tech: [], projectIds: [], location: "" },
    projects: { tagline: "", tech: [], highlights: [], featured: false },
    skills: { skills: [] },
    achievements: { date: "", description: "" },
    education: { field: "", location: "" },
    certifications: { issuer: "", date: "" },
    customSections: { items: [] },
  };
  return { id, ...blanks[collection] };
}

export const collectionLabels: Record<CollectionKey, string> = {
  experience: "role",
  projects: "project",
  skills: "skill group",
  achievements: "achievement",
  education: "education",
  certifications: "certification",
  customSections: "section",
};
