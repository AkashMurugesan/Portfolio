"use client";

import { Star } from "lucide-react";
import { useMemo, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { cn, EmptyState } from "@/components/ui/primitives";
import { useCollectionEditor } from "../../admin/collection-editor";
import type { Project } from "../../model/types";
import { usePortfolio } from "../../state/portfolio-context";
import { SectionHeader, TechList } from "../section-header";
import { useSectionNav } from "../shell/section-nav";

export function ProjectsSection() {
  const { portfolio } = usePortfolio();
  const { focusId, go } = useSectionNav();
  const editor = useCollectionEditor("projects");
  const { projects, experience } = portfolio;
  const [filter, setFilter] = useState<string | null>(null);
  const [dismissedFocus, setDismissedFocus] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // A deep link (e.g. from Experience) opens that project once.
  const openId = selectedId ?? (focusId && focusId !== dismissedFocus ? focusId : null);
  const selected = projects.find((p) => p.id === openId) ?? null;
  const close = () => {
    setSelectedId(null);
    setDismissedFocus(focusId);
  };

  const techCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of projects)
      for (const t of p.tech) counts.set(t, (counts.get(t) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
  }, [projects]);

  const visible = filter ? projects.filter((p) => p.tech.includes(filter)) : projects;
  const companyOf = (p: Project) =>
    experience.find((e) => e.id === p.experienceId)?.company;

  return (
    <div>
      <SectionHeader
        title="Projects"
        description="Products and platforms I’ve built. Select one for details."
        actions={editor.addButton()}
      />

      <div
        className="mb-5 flex flex-wrap gap-2"
        role="group"
        aria-label="Filter by technology"
      >
        <FilterChip active={filter === null} onClick={() => setFilter(null)}>
          All <span className="text-faint">{projects.length}</span>
        </FilterChip>
        {techCounts.map(([tech, count]) => (
          <FilterChip
            key={tech}
            active={filter === tech}
            onClick={() => setFilter(filter === tech ? null : tech)}
          >
            {tech} <span className="text-faint">{count}</span>
          </FilterChip>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState title="No projects match this filter." />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {visible.map((p) => (
          <article
            key={p.id}
            className="border-line bg-card hover:border-accent/50 hover:bg-card-hover flex flex-col rounded-xl border transition"
          >
            <button onClick={() => setSelectedId(p.id)} className="flex-1 p-5 text-left">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{p.name}</h3>
                {p.featured ? (
                  <Star className="text-warning size-3.5" aria-label="Featured" />
                ) : null}
              </div>
              <p className="text-faint mt-0.5 font-mono text-xs">
                {companyOf(p) ?? "Independent / client"}
              </p>
              <p className="text-muted mt-2 text-sm">{p.tagline}</p>
              <div className="mt-4">
                <TechList tech={p.tech} highlight={(t) => t === filter} />
              </div>
            </button>
            {editor.itemActions(p, projects.indexOf(p), projects.length) ? (
              <div className="border-line flex justify-end border-t px-3 py-2">
                {editor.itemActions(p, projects.indexOf(p), projects.length)}
              </div>
            ) : null}
          </article>
        ))}
      </div>

      <Dialog
        open={selected !== null}
        onClose={close}
        title={selected?.name ?? ""}
        description={selected?.tagline}
        wide
      >
        {selected ? (
          <div className="space-y-5">
            <div>
              <p className="eyebrow mb-2">What I did</p>
              <ul className="space-y-2">
                {selected.highlights.map((h) => (
                  <li key={h} className="flex gap-2 text-sm leading-relaxed">
                    <span className="text-accent mt-0.5 font-mono">▸</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-2">Stack</p>
              <TechList tech={selected.tech} />
            </div>
            {companyOf(selected) ? (
              <button
                onClick={() => {
                  close();
                  go("experience");
                }}
                className="text-accent text-sm hover:underline"
              >
                Built at {companyOf(selected)} → view role
              </button>
            ) : null}
          </div>
        ) : null}
      </Dialog>
      {editor.editor}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-lg border px-2.5 py-1 font-mono text-xs transition",
        active
          ? "border-accent/50 bg-accent-soft text-accent"
          : "border-line bg-panel text-muted hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}
