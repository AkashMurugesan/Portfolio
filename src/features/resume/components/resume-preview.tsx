import type { ResumeDocument } from "../engine/types";

/** On-screen preview mirroring the PDF layout. Matched skills are highlighted. */
export function ResumePreview({ doc }: { doc: ResumeDocument }) {
  return (
    <div className="rounded-lg bg-white p-6 text-[13px] leading-snug text-neutral-900 shadow-sm sm:p-8">
      <h3 className="text-2xl font-bold">{doc.name}</h3>
      <p className="text-neutral-700">{doc.headline}</p>
      <p className="mt-1 text-xs text-neutral-600">{doc.contact.join("  |  ")}</p>

      <PreviewSection title="Professional Summary">
        <p>{doc.summary}</p>
      </PreviewSection>

      <PreviewSection title="Technical Skills">
        {doc.skills.map((g) => (
          <p key={g.category} className="mb-0.5">
            <span className="font-semibold">{g.category}: </span>
            {g.items.map((item, i) => (
              <span key={item.name}>
                <span
                  className={
                    item.matched ? "rounded bg-blue-100 px-0.5 text-blue-900" : undefined
                  }
                >
                  {item.name}
                </span>
                {i < g.items.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        ))}
      </PreviewSection>

      <PreviewSection title="Professional Experience">
        {doc.experience.map((e) => (
          <div key={`${e.company}-${e.role}`} className="mb-3">
            <div className="flex flex-wrap justify-between gap-x-4">
              <p className="font-semibold">
                {e.company} | {e.role}
              </p>
              <p className="text-neutral-600">{e.dates}</p>
            </div>
            <p className="text-neutral-600 italic">{e.location}</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-5">
              {e.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </PreviewSection>

      {doc.projects.length > 0 ? (
        <PreviewSection title="Selected Projects">
          {doc.projects.map((p) => (
            <div key={p.name} className="mb-2.5">
              <p>
                <span className="font-semibold">{p.name}</span>
                <span className="text-neutral-600 italic"> {p.tech.join(" | ")}</span>
              </p>
              <ul className="mt-0.5 list-disc space-y-0.5 pl-5">
                {p.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </PreviewSection>
      ) : null}

      {doc.achievements.length > 0 ? (
        <PreviewSection title="Awards & Recognition">
          <ul className="list-disc space-y-0.5 pl-5">
            {doc.achievements.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </PreviewSection>
      ) : null}

      {doc.certifications.length > 0 ? (
        <PreviewSection title="Certifications">
          <ul className="list-disc space-y-0.5 pl-5">
            {doc.certifications.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </PreviewSection>
      ) : null}

      <PreviewSection title="Education">
        {doc.education.map((e) => (
          <div key={e.title}>
            <p className="font-semibold">{e.title}</p>
            <p className="text-neutral-600">{e.detail}</p>
          </div>
        ))}
      </PreviewSection>
    </div>
  );
}

function PreviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-4">
      <h4 className="mb-1.5 border-b border-neutral-400 pb-0.5 text-[13px] font-bold tracking-wide uppercase">
        {title}
      </h4>
      {children}
    </section>
  );
}
