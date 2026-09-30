"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn, EmptyState } from "@/components/ui/primitives";
import { useCollectionEditor } from "../../admin/collection-editor";
import { formatDuration, formatRange } from "../../model/derive";
import { usePortfolio } from "../../state/portfolio-context";
import { SectionHeader, TechList } from "../section-header";
import { useSectionNav } from "../shell/section-nav";

export function ExperienceSection() {
  const { portfolio } = usePortfolio();
  const { go } = useSectionNav();
  const editor = useCollectionEditor("experience");
  const { experience, projects } = portfolio;
  // First (most recent) role starts expanded.
  const [open, setOpen] = useState<Set<string>>(
    () => new Set(experience.slice(0, 1).map((e) => e.id)),
  );

  const toggle = (id: string) =>
    setOpen((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div>
      <SectionHeader
        title="Career timeline"
        description="Roles, what I owned, and the projects delivered in each."
        actions={editor.addButton()}
      />

      {experience.length === 0 ? <EmptyState title="No experience added yet." /> : null}

      <ol className="relative space-y-4">
        <span aria-hidden className="bg-line absolute top-2 bottom-2 left-[7px] w-px" />
        {experience.map((role, index) => {
          const isOpen = open.has(role.id);
          const roleProjects = projects.filter(
            (p) => role.projectIds.includes(p.id) || p.experienceId === role.id,
          );
          return (
            <li key={role.id} className="relative pl-8">
              <span
                aria-hidden
                className={cn(
                  "absolute top-5 left-0 size-[15px] rounded-full border-2",
                  role.end ? "border-line-strong bg-bg" : "border-accent bg-accent-soft",
                )}
              />
              <div className="border-line bg-card rounded-xl border">
                <div className="flex items-start gap-3 p-5">
                  <button
                    onClick={() => toggle(role.id)}
                    aria-expanded={isOpen}
                    className="flex-1 text-left"
                  >
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="text-lg font-semibold">{role.company}</h3>
                      <span className="text-accent text-sm font-medium">{role.role}</span>
                      {!role.end ? (
                        <span className="bg-success-soft text-success rounded px-1.5 py-0.5 font-mono text-[10px] uppercase">
                          Current
                        </span>
                      ) : null}
                    </div>
                    <p className="text-faint mt-1 font-mono text-xs">
                      {formatRange(role.start, role.end)} ·{" "}
                      {formatDuration(role.start, role.end)} · {role.location}
                    </p>
                    <p className="text-muted mt-3 text-sm leading-relaxed">
                      {role.summary}
                    </p>
                  </button>
                  <div className="flex items-center gap-2">
                    {editor.itemActions(role, index, experience.length)}
                    <button
                      onClick={() => toggle(role.id)}
                      aria-label={isOpen ? "Collapse" : "Expand"}
                      className="text-faint hover:text-fg rounded-md p-1.5"
                    >
                      <ChevronDown
                        className={cn(
                          "size-4 transition-transform",
                          isOpen && "rotate-180",
                        )}
                      />
                    </button>
                  </div>
                </div>

                {isOpen ? (
                  <div className="border-line space-y-5 border-t p-5">
                    <div>
                      <p className="eyebrow mb-2">Highlights</p>
                      <ul className="space-y-2">
                        {role.highlights.map((h) => (
                          <li key={h} className="flex gap-2 text-sm leading-relaxed">
                            <span className="text-accent mt-0.5 font-mono">▸</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {roleProjects.length > 0 ? (
                      <div>
                        <p className="eyebrow mb-2">Projects</p>
                        <div className="flex flex-wrap gap-2">
                          {roleProjects.map((p) => (
                            <button
                              key={p.id}
                              onClick={() => go("projects", p.id)}
                              className="border-line bg-panel hover:border-accent/50 rounded-lg border px-3 py-1.5 text-left text-sm transition"
                            >
                              <span className="font-medium">{p.name}</span>
                              <span className="text-faint"> — {p.tagline}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    <div>
                      <p className="eyebrow mb-2">Technologies</p>
                      <TechList tech={role.tech} />
                    </div>
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
      {editor.editor}
    </div>
  );
}
