import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs,cjs}"],
    ignores: [
      "src/server/repos/**",
      "src/lib/db/**",
      "scripts/**",
      "drizzle.config.*",
      "seed.ts",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/lib/db",
              message: "Import db only from src/server/repos; use a service instead.",
            },
            {
              name: "@/lib/db/index",
              message: "Import db only from src/server/repos; use a service instead.",
            },
            {
              name: "@/lib/db/index.ts",
              message: "Import db only from src/server/repos; use a service instead.",
            },
            {
              name: "@/lib/db/index.tsx",
              message: "Import db only from src/server/repos; use a service instead.",
            },
            {
              name: "@/lib/db/index.js",
              message: "Import db only from src/server/repos; use a service instead.",
            },
            {
              name: "@/lib/db/index.mjs",
              message: "Import db only from src/server/repos; use a service instead.",
            },
          ],
          patterns: [
            {
              regex: "^(?:\\.\\.?/)+lib/db(?:/index(?:\\.(?:ts|tsx|js|mjs))?)?$",
              message: "Import db only from src/server/repos; use a service instead.",
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
