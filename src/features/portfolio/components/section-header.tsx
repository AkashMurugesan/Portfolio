import type { ReactNode } from "react";

export function SectionHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description ? <p className="text-muted mt-1 text-sm">{description}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function TechList({
  tech,
  highlight,
}: {
  tech: string[];
  highlight?: (t: string) => boolean;
}) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
      {tech.map((t) => (
        <li
          key={t}
          className={
            highlight?.(t)
              ? "border-accent/40 bg-accent-soft text-accent rounded-md border px-2 py-0.5 font-mono text-xs"
              : "border-line bg-panel text-muted rounded-md border px-2 py-0.5 font-mono text-xs"
          }
        >
          {t}
        </li>
      ))}
    </ul>
  );
}
