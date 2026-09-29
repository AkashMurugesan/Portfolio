import type { Metadata } from "next";
import Link from "next/link";
import { signOut } from "@/server/auth";
import { requireAdmin } from "@/server/auth/guard";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const session = await requireAdmin();

  async function signOutAction() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-foreground/10 border-b">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/admin" className="font-mono text-sm">
            ~/admin
          </Link>
          <div className="text-foreground/70 flex items-center gap-3 text-sm">
            <span className="hidden sm:inline">{session.user.name}</span>
            <form action={signOutAction}>
              <button type="submit" className="underline-offset-4 hover:underline">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
