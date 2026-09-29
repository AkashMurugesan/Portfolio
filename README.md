# Portfolio

A long-lived personal platform with two parts that share one data store:

- **Public portfolio.** A curated, evidence-backed story covering work, projects, writing and direction.
- **Private growth dashboard.** Weekly reviews, habits and goals, visible only to the admin.

The core idea is to **record once and publish selectively**. Every content item has a visibility of `draft | private | unlisted | public`.

## Stack

- Next.js 16 (App Router) and TypeScript
- Tailwind CSS 4
- Postgres through Drizzle ORM. Locally it uses embedded [PGlite](https://pglite.dev), so Docker is not required.
- Auth.js with GitHub OAuth. Exactly one allowlisted account can sign in.
- Vitest, ESLint, Prettier and GitHub Actions

## Getting started

```bash
npm install
cp .env.example .env.local      # then fill in the values (see below)
npm run db:migrate              # creates ./.data/pglite and applies migrations
npm run dev                     # http://localhost:3000
```

### Admin sign-in (GitHub OAuth)

1. Create an OAuth App at <https://github.com/settings/developers>. Set the homepage to `http://localhost:3000` and the callback URL to `http://localhost:3000/api/auth/callback/github`.
2. Put the client ID and secret in `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET`.
3. Set `ADMIN_GITHUB_ID` to your numeric GitHub user ID. You can find it with `curl https://api.github.com/users/<username>`.
4. Generate `AUTH_SECRET` with `npx auth secret`.

Any other GitHub account is rejected. If `ADMIN_GITHUB_ID` is empty, nobody can sign in, so the check fails closed.

## Scripts

| Script                                 | Purpose                                            |
| -------------------------------------- | -------------------------------------------------- |
| `npm run dev` / `build` / `start`      | Next.js                                            |
| `npm run lint` / `typecheck` / `test`  | Quality checks (all run in CI)                     |
| `npm run format`                       | Prettier                                           |
| `npm run db:generate -- --name <name>` | Create a migration from schema changes             |
| `npm run db:migrate`                   | Apply migrations (`DATABASE_URL`, or local PGlite) |
| `npm run db:studio`                    | Drizzle Studio                                     |

The PGlite data directory can only be opened by one process at a time. Stop `npm run dev` before running `db:migrate` or `db:studio` against it.

## Project layout

```
src/app/(public)/     public routes. They may only import @/server/dal/public (enforced by ESLint).
src/app/admin/        admin routes, protected by proxy.ts and requireAdmin()
src/app/login/        GitHub sign-in
src/server/auth/      Auth.js config, allowlist, requireAdmin guard
src/server/db/        Drizzle schema, client factory (Postgres | PGlite), migrate script
drizzle/              generated SQL migrations (commit these)
```

## Privacy model

- `proxy.ts` redirects signed-out requests for `/admin/**` to `/login`.
- Every admin page, layout and server action also calls `requireAdmin()`. The proxy is only the first line of defense.
- Public pages read through a visibility-safe data-access layer. It returns only `public` items, resolves `unlisted` items by exact slug only, and never selects `private_notes`.

## Deployment

- **MVP:** Vercel with Neon Postgres. Set `DATABASE_URL`, the `AUTH_*` variables and `ADMIN_GITHUB_ID`, and run `npm run db:migrate` against Neon.
- **Self-hosting (V1):** `docker compose up --build` starts Postgres, runs migrations and then starts the app on port 3000. Set `AUTH_TRUST_HOST=true` when self-hosting.
