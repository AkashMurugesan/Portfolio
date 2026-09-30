"use client";

import { Award, Briefcase, GraduationCap, type LucideIcon } from "lucide-react";
import { useMemo } from "react";
import { formatYearMonth, journey, type JourneyEvent } from "../../model/derive";
import { usePortfolio } from "../../state/portfolio-context";
import { SectionHeader } from "../section-header";

const KIND: Record<JourneyEvent["kind"], { icon: LucideIcon; label: string }> = {
  education: { icon: GraduationCap, label: "Education" },
  role: { icon: Briefcase, label: "Career" },
  achievement: { icon: Award, label: "Recognition" },
  certification: { icon: Award, label: "Certification" },
};

export function JourneySection() {
  const { portfolio } = usePortfolio();
  const events = useMemo(() => journey(portfolio), [portfolio]);

  const byYear = new Map<string, JourneyEvent[]>();
  for (const e of events) {
    const year = String(e.date).slice(0, 4);
    byYear.set(year, [...(byYear.get(year) ?? []), e]);
  }

  return (
    <div>
      <SectionHeader
        title="Career journey"
        description="Built automatically from experience, education and achievements — update those and this follows."
      />
      <div className="space-y-8">
        {[...byYear.entries()].map(([year, items]) => (
          <section key={year} className="grid gap-4 sm:grid-cols-[80px_1fr]">
            <p className="text-accent font-mono text-sm font-semibold sm:pt-3">{year}</p>
            <ol className="border-line space-y-3 border-l pl-5">
              {items.map((e) => {
                const { icon: Icon, label } = KIND[e.kind];
                return (
                  <li key={e.id} className="relative">
                    <span className="border-line bg-card text-accent absolute top-3 -left-[33px] flex size-6 items-center justify-center rounded-full border">
                      <Icon className="size-3" />
                    </span>
                    <div className="border-line bg-card rounded-xl border px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="eyebrow">{label}</span>
                        <span className="text-faint font-mono text-xs">
                          {/^\d{4}-\d{2}$/.test(String(e.date))
                            ? formatYearMonth(String(e.date))
                            : e.date}
                        </span>
                      </div>
                      <p className="mt-1 font-medium">{e.title}</p>
                      <p className="text-muted mt-0.5 text-sm">{e.detail}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
