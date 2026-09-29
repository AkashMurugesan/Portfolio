import "server-only";
import { redirect } from "next/navigation";
import { auth } from ".";
import { isAllowedAdmin } from "./allowlist";

/**
 * Server-side admin check. Call at the top of every admin page, layout and
 * server action — proxy.ts is only the first line of defense.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session || !isAllowedAdmin(session.user.githubId)) redirect("/login");
  return session;
}
