"use client";

import { createContext, useContext } from "react";

export type SectionNav = {
  active: string;
  /** Switch section; optionally highlight an item (e.g. a project id). */
  go: (sectionId: string, focusId?: string) => void;
  focusId: string | null;
};

export const SectionNavContext = createContext<SectionNav | null>(null);

export function useSectionNav(): SectionNav {
  const ctx = useContext(SectionNavContext);
  if (!ctx) throw new Error("useSectionNav must be used inside the portfolio shell");
  return ctx;
}
