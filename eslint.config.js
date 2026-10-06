import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

const production = ["src/**/*.{ts,tsx}"];
const tests = ["src/tests/**"];
const runtimeEntrypoints = [
  "src/data/connection.ts",
  "src/app/theme.tsx",
  "src/main.tsx",
];
const testImports = {
  regex: "(?:^|/)(?:tests|vitest|@testing-library)(?:/|$)",
  message: "Production modules must not import test code.",
};
const resetImport = {
  regex: "(?:^|/)(?:data/)?connection(?:\\.ts)?$",
  importNames: ["resetDatabaseConnectionForTests"],
  message: "Connection reset is a test-only seam.",
};
const tauriImports = {
  group: ["@tauri-apps/*", "@tauri-apps/**"],
  message: "Tauri access belongs in the runtime entrypoints.",
};
const boundary = (regex) => ({
  regex,
  message: "Import violates the engineering module boundary.",
});
const restrict = (...patterns) => [
  "error",
  { patterns: [testImports, resetImport, ...patterns] },
];

export default tseslint.config(
  {
    ignores: [
      "dist",
      "src-tauri/target",
      "node_modules",
      "test-results",
      "playwright-report",
      "output",
      ".omx",
      ".omc",
    ],
  },
  {
    files: ["eslint.config.js", "scripts/**/*.mjs"],
    extends: [js.configs.recommended],
    languageOptions: { globals: { process: "readonly", console: "readonly" } },
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: [
          "./tsconfig.json",
          "./tsconfig.test.json",
          "./tsconfig.node.json",
        ],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        window: "readonly",
        document: "readonly",
        HTMLElement: "readonly",
        HTMLButtonElement: "readonly",
        HTMLInputElement: "readonly",
        Event: "readonly",
        process: "readonly",
        console: "readonly",
      },
    },
    plugins: { "react-hooks": reactHooks, "react-refresh": reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": "off",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true, allowBoolean: true },
      ],
    },
  },
  {
    files: production,
    ignores: tests,
    rules: {
      "no-restricted-imports": restrict(),
      "no-restricted-syntax": [
        "error",
        {
          selector: "ImportExpression",
          message:
            "Use static imports in production so module boundaries can be checked.",
        },
      ],
    },
  },
  {
    files: production,
    ignores: [...tests, ...runtimeEntrypoints],
    rules: { "no-restricted-imports": restrict(tauriImports) },
  },
  {
    files: ["src/pages/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": restrict(
        tauriImports,
        boundary("(?:^|/)data(?:$|/(?!repositories(?:/|$)))"),
      ),
    },
  },
  {
    files: ["src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": restrict(
        tauriImports,
        boundary("(?:^|/)(?:app|pages|data|patterns|layout)(?:/|$)"),
      ),
    },
  },
  {
    files: ["src/components/patterns/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": restrict(
        tauriImports,
        boundary("(?:^|/)(?:app|pages|data)(?:/|$)"),
      ),
    },
  },
  {
    files: ["src/data/**/*.{ts,tsx}"],
    ignores: ["src/data/connection.ts"],
    rules: {
      "no-restricted-imports": restrict(
        tauriImports,
        boundary("(?:^|/)(?:pages|components)(?:/|$)|^react(?:-dom)?(?:/|$)"),
      ),
    },
  },
  {
    files: ["src/data/connection.ts"],
    rules: {
      "no-restricted-imports": restrict(
        boundary("(?:^|/)(?:pages|components)(?:/|$)|^react(?:-dom)?(?:/|$)"),
      ),
    },
  },
);
