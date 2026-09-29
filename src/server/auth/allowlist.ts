/**
 * True only when `githubId` matches the single allowlisted admin account.
 * Fails closed: a missing ADMIN_GITHUB_ID means nobody is admin.
 */
export function isAllowedAdmin(
  githubId: unknown,
  allowedId: string | undefined = process.env.ADMIN_GITHUB_ID,
): boolean {
  const allowed = allowedId?.trim();
  if (!allowed) return false;
  if (typeof githubId !== "string" && typeof githubId !== "number") return false;
  return String(githubId) === allowed;
}
