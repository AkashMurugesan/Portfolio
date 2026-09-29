import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Privacy boundary: public routes may only read data through the
  // visibility-safe public data-access layer (src/server/dal/public).
  {
    files: ["src/app/(public)/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/server/db",
                "@/server/db/*",
                "@/server/dal/admin",
                "@/server/dal/admin/*",
              ],
              message:
                "Public routes must read data via @/server/dal/public only (visibility-safe).",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated SQL migrations and local database files.
    "drizzle/**",
    ".data/**",
  ]),
]);

export default eslintConfig;
