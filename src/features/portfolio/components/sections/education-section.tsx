"use client";

import { BadgeCheck, GraduationCap } from "lucide-react";
import { EmptyState } from "@/components/ui/primitives";
import { useCollectionEditor } from "../../admin/collection-editor";
import { formatRange } from "../../model/derive";
import { usePortfolio } from "../../state/portfolio-context";
import { SectionHeader } from "../section-header";

export function EducationSection() {
  const { portfolio, isAdmin } = usePortfolio();
  const education = useCollectionEditor("education");
  const certs = useCollectionEditor("certifications");

  return (
    <div className="space-y-10">
      <section>
        <SectionHeader title="Education" actions={education.addButton()} />
        {portfolio.education.length === 0 ? (
          <EmptyState title="No education added yet." />
        ) : null}
        <div className="grid gap-4 md:grid-cols-2">
          {portfolio.education.map((e, index) => (
            <div
              key={e.id}
              className="border-line bg-card flex gap-4 rounded-xl border p-5"
            >
              <span className="bg-accent-soft text-accent flex size-10 shrink-0 items-center justify-center rounded-lg">
                <GraduationCap className="size-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold">{e.institution}</p>
                  {education.itemActions(e, index, portfolio.education.length)}
                </div>
                <p className="text-muted text-sm">
                  {e.degree}
                  {e.field ? `, ${e.field}` : ""}
                </p>
                <p className="text-faint mt-1 font-mono text-xs">
                  {formatRange(e.start, e.end)} · {e.location}
                  {e.grade ? ` · ${e.grade}` : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Viewers only see certifications once there are some. */}
      {portfolio.certifications.length > 0 || isAdmin ? (
        <section>
          <SectionHeader title="Certifications" actions={certs.addButton()} />
          {portfolio.certifications.length === 0 ? (
            <EmptyState title="No certifications yet.">
              Hidden from viewers until you add one.
            </EmptyState>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            {portfolio.certifications.map((c, index) => (
              <div
                key={c.id}
                className="border-line bg-card flex gap-4 rounded-xl border p-5"
              >
                <span className="bg-success-soft text-success flex size-10 shrink-0 items-center justify-center rounded-lg">
                  <BadgeCheck className="size-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold">{c.name}</p>
                    {certs.itemActions(c, index, portfolio.certifications.length)}
                  </div>
                  <p className="text-muted text-sm">
                    {[c.issuer, c.date].filter(Boolean).join(" · ")}
                  </p>
                  {c.url ? (
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent mt-1 inline-block text-sm hover:underline"
                    >
                      View credential ↗
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
      {education.editor}
      {certs.editor}
    </div>
  );
}
