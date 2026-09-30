import { ArrowRight, Eye, Shield } from "lucide-react";
import Link from "next/link";
import { getPortfolio } from "@/features/portfolio/data/repository";

// Role selection. Not authentication: Admin edits stay in the browser (local
// draft) until server persistence is added behind the GitHub admin login.
export default async function RoleSelectPage() {
  const { profile } = await getPortfolio();

  const roles = [
    {
      href: "/portfolio",
      icon: Eye,
      title: "Viewer",
      description: "Explore experience, projects, skills and career journey. Read-only.",
    },
    {
      href: "/portfolio/edit",
      icon: Shield,
      title: "Admin",
      description:
        "Same portfolio with add, edit and delete controls. Changes are saved as a local draft.",
    },
  ];

  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-16">
      <div className="bg-accent/10 pointer-events-none absolute top-1/4 left-1/2 size-[520px] -translate-x-1/2 rounded-full blur-3xl" />
      <div className="relative w-full max-w-2xl">
        <p className="text-accent font-mono text-xs">~/portfolio --select-role</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {profile.name}
        </h1>
        <p className="text-muted mt-2">{profile.headline}</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {roles.map(({ href, icon: Icon, title, description }) => (
            <Link
              key={href}
              href={href}
              className="border-line bg-card hover:border-accent/60 hover:bg-card-hover group focus-visible:outline-accent rounded-xl border p-6 transition focus-visible:outline-2"
            >
              <span className="bg-accent-soft text-accent flex size-10 items-center justify-center rounded-lg">
                <Icon className="size-5" />
              </span>
              <p className="mt-4 flex items-center justify-between text-lg font-semibold">
                {title}
                <ArrowRight className="text-faint group-hover:text-accent size-4 transition group-hover:translate-x-0.5" />
              </p>
              <p className="text-muted mt-1.5 text-sm leading-relaxed">{description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
