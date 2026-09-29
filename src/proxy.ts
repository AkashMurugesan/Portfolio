// First line of defense for /admin: redirects signed-out visitors to /login
// via the `authorized` callback. Pages and actions still call requireAdmin().
export { auth as proxy } from "@/server/auth";

export const config = {
  matcher: ["/admin/:path*"],
};
