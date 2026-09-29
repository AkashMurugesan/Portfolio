import NextAuth, { type DefaultSession } from "next-auth";
import GitHub from "next-auth/providers/github";
import { isAllowedAdmin } from "./allowlist";

declare module "next-auth" {
  interface Session {
    user: { githubId?: string } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    githubId?: string;
  }
}

// Reads AUTH_SECRET, AUTH_GITHUB_ID and AUTH_GITHUB_SECRET from the environment.
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    // Reject every GitHub account except the allowlisted one.
    signIn({ account, profile }) {
      return account?.provider === "github" && isAllowedAdmin(profile?.id);
    },
    jwt({ token, profile }) {
      if (profile?.id != null) token.githubId = String(profile.id);
      return token;
    },
    session({ session, token }) {
      session.user.githubId = token.githubId;
      return session;
    },
    // Used by proxy.ts: unauthorized /admin requests redirect to sign-in.
    authorized({ auth }) {
      return isAllowedAdmin(auth?.user?.githubId);
    },
  },
});
