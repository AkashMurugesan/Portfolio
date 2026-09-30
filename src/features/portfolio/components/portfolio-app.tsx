"use client";

import { Download, FileText, Menu, RotateCcw, Shield, Eye, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Button, cn } from "@/components/ui/primitives";
import { ResumeGenerator } from "@/features/resume/components/resume-generator";
import { useCollectionEditor } from "../admin/collection-editor";
import type { Portfolio } from "../model/types";
import { PortfolioProvider, usePortfolio, type Mode } from "../state/portfolio-context";
import { AchievementsSection } from "./sections/achievements-section";
import { CustomSectionView } from "./sections/custom-section";
import { EducationSection } from "./sections/education-section";
import { ExperienceSection } from "./sections/experience-section";
import { JourneySection } from "./sections/journey-section";
import { OverviewSection } from "./sections/overview-section";
import { ProjectsSection } from "./sections/projects-section";
import { SkillsSection } from "./sections/skills-section";
import { buildSections, RESUME_SECTION, type SectionDef } from "./shell/sections";
import { SectionNavContext, useSectionNav, type SectionNav } from "./shell/section-nav";
import { ThemeToggle } from "./shell/theme-toggle";

/** Root of the portfolio experience, shared by Viewer and Admin modes. */
export function PortfolioApp({ initial, mode }: { initial: Portfolio; mode: Mode }) {
  return (
    <PortfolioProvider initial={initial} mode={mode}>
      <Shell />
    </PortfolioProvider>
  );
}

// The URL hash is the navigation state: #projects or #projects/catman.
function subscribeHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}
const getHash = () => window.location.hash.slice(1);

function Shell() {
  const { portfolio, isAdmin } = usePortfolio();
  const sections = useMemo(() => buildSections(portfolio, isAdmin), [portfolio, isAdmin]);
  const hash = useSyncExternalStore(subscribeHash, getHash, () => "");
  const [sectionId, focusId = null] = hash.split("/");
  const active = sections.find((s) => s.id === sectionId) ?? sections[0];
  const [menuOpen, setMenuOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  const go = useCallback((id: string, focus?: string) => {
    window.location.hash = focus ? `${id}/${focus}` : id;
    setMenuOpen(false);
    mainRef.current?.scrollTo({ top: 0 });
  }, []);

  const nav = useMemo<SectionNav>(
    () => ({ active: active.id, go, focusId }),
    [active.id, go, focusId],
  );
  const index = sections.indexOf(active);

  return (
    <SectionNavContext.Provider value={nav}>
      <div className="flex h-dvh overflow-hidden">
        {/* Sidebar: static on desktop, drawer on mobile */}
        <div
          className={cn(
            "fixed inset-0 z-40 bg-black/50 lg:hidden",
            menuOpen ? "block" : "hidden",
          )}
          onClick={() => setMenuOpen(false)}
          aria-hidden
        />
        <aside
          className={cn(
            "border-line bg-sidebar fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r transition-transform lg:static lg:translate-x-0",
            menuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <Sidebar
            sections={sections}
            active={active.id}
            onClose={() => setMenuOpen(false)}
          />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar
            section={active}
            index={index}
            total={sections.length}
            onMenu={() => setMenuOpen(true)}
          />
          <main ref={mainRef} className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              <SectionContent id={active.id} />
            </div>
          </main>
        </div>
      </div>
    </SectionNavContext.Provider>
  );
}

function SectionContent({ id }: { id: string }) {
  switch (id) {
    case "overview":
      return <OverviewSection />;
    case "experience":
      return <ExperienceSection />;
    case "projects":
      return <ProjectsSection />;
    case "skills":
      return <SkillsSection />;
    case "journey":
      return <JourneySection />;
    case "achievements":
      return <AchievementsSection />;
    case "education":
      return <EducationSection />;
    case RESUME_SECTION:
      return <ResumeGenerator />;
    default:
      return id.startsWith("custom-") ? (
        <CustomSectionView key={id} sectionId={id.slice("custom-".length)} />
      ) : (
        <OverviewSection />
      );
  }
}

function Sidebar({
  sections,
  active,
  onClose,
}: {
  sections: SectionDef[];
  active: string;
  onClose: () => void;
}) {
  const { portfolio, mode } = usePortfolio();
  const { go } = useSectionNav();
  const customEditor = useCollectionEditor("customSections");
  const initials = portfolio.profile.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const groups: { key: SectionDef["group"]; label: string }[] = [
    { key: "portfolio", label: "Portfolio" },
    { key: "custom", label: "More" },
    { key: "tools", label: "Tools" },
  ];
  let n = 0;

  return (
    <>
      <div className="border-line flex items-center gap-3 border-b px-5 py-4">
        <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-bold text-white">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{portfolio.profile.name}</p>
          <p className="text-faint truncate text-[10px] tracking-[0.14em] uppercase">
            {portfolio.profile.headline.split("·")[0]}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-faint hover:text-fg lg:hidden"
          aria-label="Close menu"
        >
          <X className="size-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Portfolio sections">
        {groups.map((g) => {
          const items = sections.filter((s) => s.group === g.key);
          if (items.length === 0 && !(g.key === "custom" && mode === "admin"))
            return null;
          return (
            <div key={g.key} className="mb-5">
              <p className="eyebrow mb-2 px-2">{g.label}</p>
              <ul className="space-y-0.5">
                {items.map((s) => {
                  n++;
                  const isActive = s.id === active;
                  return (
                    <li key={s.id}>
                      <button
                        onClick={() => go(s.id)}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg border px-2.5 py-2 text-left text-sm transition",
                          isActive
                            ? "border-accent/30 bg-accent-soft text-accent"
                            : "text-muted hover:text-fg hover:bg-card-hover border-transparent",
                        )}
                      >
                        <span
                          className={cn(
                            "font-mono text-xs",
                            isActive ? "text-accent" : "text-faint",
                          )}
                        >
                          {String(n).padStart(2, "0")}
                        </span>
                        <span className="flex-1 truncate">{s.label}</span>
                        {s.count !== undefined ? (
                          <span className="text-faint font-mono text-[11px]">
                            {s.count}
                          </span>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {g.key === "custom" ? (
                <div className="mt-2 px-1">{customEditor.addButton("Add section")}</div>
              ) : null}
            </div>
          );
        })}
      </nav>

      <div className="border-line border-t px-4 py-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted inline-flex items-center gap-1.5">
            {mode === "admin" ? (
              <Shield className="size-3.5" />
            ) : (
              <Eye className="size-3.5" />
            )}
            {mode === "admin" ? "Admin mode" : "Viewer mode"}
          </span>
          <Link href="/" className="text-accent hover:underline">
            Switch role
          </Link>
        </div>
      </div>
      {customEditor.editor}
    </>
  );
}

function TopBar({
  section,
  index,
  total,
  onMenu,
}: {
  section: SectionDef;
  index: number;
  total: number;
  onMenu: () => void;
}) {
  const { portfolio, isAdmin, isDirty, resetDraft } = usePortfolio();
  const { go } = useSectionNav();
  const progress = Math.round(((index + 1) / total) * 100);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(portfolio, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="border-line bg-panel/80 border-b backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          onClick={onMenu}
          className="text-muted hover:text-fg -ml-1 rounded-md p-1.5 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-faint truncate text-xs">
            {portfolio.profile.name} <span className="text-muted">/</span> Section{" "}
            {String(index + 1).padStart(2, "0")}
          </p>
          <h1 className="truncate text-base font-semibold sm:text-lg">
            {section.label}{" "}
            <span className="text-muted hidden font-normal sm:inline">
              — {String(index + 1).padStart(2, "0")} of {String(total).padStart(2, "0")}
            </span>
          </h1>
        </div>

        <div className="hidden w-28 md:block" aria-hidden>
          <div className="bg-line h-1.5 overflow-hidden rounded-full">
            <div
              className="bg-accent h-full rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-faint mt-1 text-right font-mono text-[10px]">
            {progress}% explored
          </p>
        </div>

        {isAdmin ? (
          <div className="flex items-center gap-2">
            {isDirty ? (
              <span className="bg-warning/15 text-warning hidden rounded-md px-2 py-1 font-mono text-[10px] uppercase sm:inline">
                Local draft
              </span>
            ) : null}
            <Button size="sm" onClick={exportJson} aria-label="Export data as JSON">
              <Download className="size-3.5" />
              <span className="hidden xl:inline">Export</span>
            </Button>
            <Button
              size="sm"
              disabled={!isDirty}
              aria-label="Reset to published data"
              onClick={() => {
                if (
                  window.confirm(
                    "Discard all local edits and restore the published data?",
                  )
                )
                  resetDraft();
              }}
            >
              <RotateCcw className="size-3.5" />
              <span className="hidden xl:inline">Reset</span>
            </Button>
          </div>
        ) : null}
        <ThemeToggle />
        {section.id !== RESUME_SECTION ? (
          <Button size="sm" variant="primary" onClick={() => go(RESUME_SECTION)}>
            <FileText className="size-3.5" />
            <span className="hidden sm:inline">Generate Resume</span>
          </Button>
        ) : null}
      </div>
    </header>
  );
}
