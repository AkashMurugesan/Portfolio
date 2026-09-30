"use client";

import { Trophy } from "lucide-react";
import { EmptyState } from "@/components/ui/primitives";
import { useCollectionEditor } from "../../admin/collection-editor";
import { usePortfolio } from "../../state/portfolio-context";
import { SectionHeader } from "../section-header";

export function AchievementsSection() {
  const { portfolio } = usePortfolio();
  const editor = useCollectionEditor("achievements");
  const { achievements } = portfolio;

  return (
    <div>
      <SectionHeader
        title="Achievements"
        description="Awards and recognition."
        actions={editor.addButton()}
      />
      {achievements.length === 0 ? (
        <EmptyState title="No achievements added yet." />
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        {achievements.map((a, index) => (
          <div
            key={a.id}
            className="border-line bg-card flex gap-4 rounded-xl border p-5"
          >
            <span className="bg-accent-soft text-accent flex size-10 shrink-0 items-center justify-center rounded-lg">
              <Trophy className="size-4.5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{a.title}</p>
                  <p className="text-faint font-mono text-xs">{a.date}</p>
                </div>
                {editor.itemActions(a, index, achievements.length)}
              </div>
              <p className="text-muted mt-2 text-sm">{a.description}</p>
            </div>
          </div>
        ))}
      </div>
      {editor.editor}
    </div>
  );
}
