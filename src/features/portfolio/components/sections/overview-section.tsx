"use client";

import { ArrowRight, FileText, Mail, MapPin, Pencil, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button, Card, Eyebrow } from "@/components/ui/primitives";
import { EntityForm } from "../../admin/entity-form";
import { profileFields } from "../../admin/schemas";
import { techEvidence, yearsOfExperience } from "../../model/derive";
import type { Profile } from "../../model/types";
import { usePortfolio } from "../../state/portfolio-context";
import { TechList } from "../section-header";
import { useSectionNav } from "../shell/section-nav";

export function OverviewSection() {
  const { portfolio, isAdmin, dispatch } = usePortfolio();
  const { go } = useSectionNav();
  const [editing, setEditing] = useState(false);
  const { profile, experience, projects } = portfolio;

  const evidence = useMemo(() => techEvidence(portfolio), [portfolio]);
  const topTech = [...evidence.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map((e) => e.tech);
  const current = experience.find((e) => !e.end);
  const featured = projects.filter((p) => p.featured);

  const stats = [
    { value: `${yearsOfExperience(portfolio)}+`, label: "Years experience" },
    { value: String(experience.length), label: "Companies" },
    { value: String(projects.length), label: "Projects" },
    { value: String(evidence.size), label: "Technologies used" },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card className="relative overflow-hidden p-6 sm:p-8">
        <div className="bg-accent/10 pointer-events-none absolute -top-24 -right-24 size-64 rounded-full blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-accent font-mono text-xs">~/whoami</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {profile.name}
            </h1>
            <p className="text-muted mt-1 text-base">{profile.headline}</p>
            <p className="mt-4 text-lg leading-relaxed">{profile.tagline}</p>
            <div className="text-muted mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              {current ? (
                <span>
                  {current.role} @ <span className="text-fg">{current.company}</span>
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5" /> {profile.location}
              </span>
              {profile.email ? (
                <a
                  href={`mailto:${profile.email}`}
                  className="hover:text-accent inline-flex items-center gap-1"
                >
                  <Mail className="size-3.5" /> {profile.email}
                </a>
              ) : null}
              {profile.links.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent underline-offset-4 hover:underline"
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            {isAdmin ? (
              <Button size="sm" onClick={() => setEditing(true)}>
                <Pencil className="size-3.5" /> Edit profile
              </Button>
            ) : null}
            <Button size="sm" variant="primary" onClick={() => go("resume")}>
              <FileText className="size-3.5" /> Generate resume
            </Button>
          </div>
        </div>
      </Card>

      {/* Stat strip */}
      <Card className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="font-mono text-2xl font-semibold">{s.value}</p>
            <p className="eyebrow mt-1">{s.label}</p>
          </div>
        ))}
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <Eyebrow>About</Eyebrow>
          <div className="mt-3 space-y-3 leading-relaxed">
            {profile.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Card>
        <Card>
          <Eyebrow>Currently focused on</Eyebrow>
          <ul className="mt-3 space-y-2.5">
            {profile.currentFocus.map((f) => (
              <li key={f} className="flex gap-2 text-sm leading-relaxed">
                <span className="text-accent font-mono">›</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {featured.length > 0 ? (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">Featured work</h3>
            <button
              onClick={() => go("projects")}
              className="text-accent inline-flex items-center gap-1 text-sm hover:underline"
            >
              All projects <ArrowRight className="size-3.5" />
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {featured.map((p) => (
              <button
                key={p.id}
                onClick={() => go("projects", p.id)}
                className="border-line bg-card hover:border-accent/50 hover:bg-card-hover group rounded-xl border p-5 text-left transition"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{p.name}</p>
                  <Star className="text-warning size-3.5" aria-label="Featured" />
                </div>
                <p className="text-muted mt-1 text-sm">{p.tagline}</p>
                <div className="mt-4">
                  <TechList tech={p.tech.slice(0, 4)} />
                </div>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <Card>
        <div className="flex items-center justify-between">
          <Eyebrow>Most-used technologies</Eyebrow>
          <button
            onClick={() => go("skills")}
            className="text-accent inline-flex items-center gap-1 text-sm hover:underline"
          >
            Evidence <ArrowRight className="size-3.5" />
          </button>
        </div>
        <p className="text-faint mt-1 text-xs">
          Ranked by how many roles and projects use them.
        </p>
        <div className="mt-3">
          <TechList tech={topTech} />
        </div>
      </Card>

      {isAdmin ? (
        <Dialog open={editing} onClose={() => setEditing(false)} title="Edit profile">
          <EntityForm
            fields={profileFields}
            initial={profile as unknown as Record<string, unknown>}
            submitLabel="Save profile"
            onCancel={() => setEditing(false)}
            onSubmit={(value) => {
              dispatch({ type: "profile/update", patch: value as Partial<Profile> });
              setEditing(false);
            }}
          />
        </Dialog>
      ) : null}
    </div>
  );
}
