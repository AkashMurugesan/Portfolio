"use client";

import { useMemo, useState } from "react";
import { Card, cn, EmptyState } from "@/components/ui/primitives";
import { useCollectionEditor } from "../../admin/collection-editor";
import { techEvidence, type TechEvidence } from "../../model/derive";
import { usePortfolio } from "../../state/portfolio-context";
import { SectionHeader } from "../section-header";
import { useSectionNav } from "../shell/section-nav";

export function SkillsSection() {
  const { portfolio } = usePortfolio();
  const { go } = useSectionNav();
  const editor = useCollectionEditor("skills");
  const evidence = useMemo(() => techEvidence(portfolio), [portfolio]);
  const max = Math.max(1, ...[...evidence.values()].map((e) => e.count));
  const [selected, setSelected] = useState<string | null>(null);
  const detail: TechEvidence | undefined = selected
    ? evidence.get(selected.toLowerCase())
    : undefined;

  return (
    <div>
      <SectionHeader
        title="Skills"
        description="Bars show evidence — how many roles and projects actually use each skill. No self-ratings."
        actions={editor.addButton()}
      />

      {portfolio.skills.length === 0 ? <EmptyState title="No skills added yet." /> : null}

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-4 md:grid-cols-2">
          {portfolio.skills.map((group, index) => (
            <Card key={group.id}>
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="eyebrow">{group.category}</p>
                {editor.itemActions(group, index, portfolio.skills.length)}
              </div>
              <ul className="space-y-1">
                {group.skills.map((skill) => {
                  const e = evidence.get(skill.toLowerCase());
                  const count = e?.count ?? 0;
                  const isSelected = selected === skill;
                  return (
                    <li key={skill}>
                      <button
                        onClick={() => setSelected(isSelected ? null : skill)}
                        aria-pressed={isSelected}
                        className={cn(
                          "grid w-full grid-cols-[1fr_auto] items-center gap-x-3 rounded-md px-2 py-1.5 text-left text-sm transition",
                          isSelected ? "bg-accent-soft" : "hover:bg-card-hover",
                        )}
                      >
                        <span className={isSelected ? "text-accent" : undefined}>
                          {skill}
                        </span>
                        <span className="text-faint font-mono text-xs">
                          {count > 0 ? `${count}×` : "—"}
                        </span>
                        <span className="bg-line col-span-2 mt-1 h-1 overflow-hidden rounded-full">
                          <span
                            className="bg-accent block h-full rounded-full"
                            style={{ width: `${(count / max) * 100}%` }}
                          />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Card>
          ))}
        </div>

        <aside className="lg:sticky lg:top-4 lg:self-start">
          <Card>
            <p className="eyebrow">Where it’s used</p>
            {!selected ? (
              <p className="text-muted mt-3 text-sm">
                Select a skill to see the roles and projects behind it.
              </p>
            ) : (
              <div className="mt-3 space-y-4">
                <p className="text-lg font-semibold">{selected}</p>
                {!detail || detail.count === 0 ? (
                  <p className="text-muted text-sm">
                    Listed as a skill, but not yet linked to a specific role or project.
                  </p>
                ) : (
                  <>
                    {detail.roles.length > 0 ? (
                      <div>
                        <p className="eyebrow mb-1.5">Roles</p>
                        <ul className="space-y-1 text-sm">
                          {detail.roles.map((r) => (
                            <li key={r.id}>
                              <button
                                onClick={() => go("experience")}
                                className="hover:text-accent text-left"
                              >
                                {r.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    {detail.projects.length > 0 ? (
                      <div>
                        <p className="eyebrow mb-1.5">Projects</p>
                        <ul className="flex flex-wrap gap-1.5">
                          {detail.projects.map((p) => (
                            <li key={p.id}>
                              <button
                                onClick={() => go("projects", p.id)}
                                className="border-line bg-panel hover:border-accent/50 rounded-md border px-2 py-1 text-sm transition"
                              >
                                {p.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            )}
          </Card>
        </aside>
      </div>
      {editor.editor}
    </div>
  );
}
