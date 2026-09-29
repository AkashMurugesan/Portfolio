import type { Metadata } from "next";
import { signIn } from "@/server/auth";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { error } = await searchParams;

  async function signInWithGitHub() {
    "use server";
    await signIn("github", { redirectTo: "/admin" });
  }

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4">
      <h1 className="font-mono text-lg">admin / sign in</h1>
      {error ? (
        <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">
          {error === "AccessDenied"
            ? "This account is not allowed to access the admin."
            : "Sign-in failed. Please try again."}
        </p>
      ) : null}
      <form action={signInWithGitHub} className="mt-6">
        <button
          type="submit"
          className="bg-foreground text-background w-full rounded-md px-4 py-2 text-sm font-medium hover:opacity-90"
        >
          Continue with GitHub
        </button>
      </form>
    </main>
  );
}
