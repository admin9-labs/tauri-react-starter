import { readFileSync } from "node:fs";
import path from "node:path";
import { ESLint } from "eslint";
import ts from "typescript";

import { DATABASE_URL, migrationDescriptors } from "@/data/migrations";
import tauriConfig from "../../../src-tauri/tauri.conf.json";

const root = process.cwd();
const eslint = new ESLint({ cwd: root });

it("rejects test globals and unsupported database capabilities in the production type environment", () => {
  const parsed = ts.getParsedCommandLineOfConfigFile(
    path.join(root, "tsconfig.json"),
    {},
    {
      ...ts.sys,
      onUnRecoverableConfigFileDiagnostic: (diagnostic) => {
        throw new Error(
          ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
        );
      },
    },
  );
  if (!parsed)
    throw new Error("Production TypeScript config could not be loaded");
  const file = path.join(root, "src/data/__type_contract_probe__.ts");
  const source = `import type { SqlDatabase } from '@/data/sqlDatabase';
declare const database: SqlDatabase;
export async function probe() {
  describe('production', () => { expect(1).toBe(1); vi.fn(); });
  await database.close();
  await database.select<number>('SELECT id');
  await database.execute('SELECT ?', [{ arbitrary: true }]);
  return database.path;
}`;
  const host = ts.createCompilerHost(parsed.options);
  const getSourceFile = host.getSourceFile.bind(host);
  host.getSourceFile = (name, languageVersion, ...rest) =>
    name === file
      ? ts.createSourceFile(file, source, languageVersion, true)
      : getSourceFile(name, languageVersion, ...rest);
  const program = ts.createProgram({
    rootNames: [file],
    options: parsed.options,
    host,
  });
  const messages = ts
    .getPreEmitDiagnostics(program)
    .filter((diagnostic) => diagnostic.file?.fileName === file)
    .map((diagnostic) =>
      ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
    )
    .join("\n");
  for (const name of ["describe", "expect", "vi"])
    expect(messages).toContain(`Cannot find name '${name}'`);
  expect(messages).toContain("Property 'close' does not exist");
  expect(messages).toContain("Property 'path' does not exist");
  expect(messages).toContain("does not satisfy the constraint 'object[]'");
  expect(messages).toContain("arbitrary");
});

it.each([
  [
    "src/pages/ComponentsPage.tsx",
    "export { getDatabase } from '@/data/connection';",
  ],
  [
    "src/pages/ComponentsPage.tsx",
    "export { getDatabase } from '../data/connection';",
  ],
  [
    "src/components/ui/button.tsx",
    "export { RecordsPage } from '../../pages/RecordsPage';",
  ],
  [
    "src/components/patterns/content-state.tsx",
    "export { routes } from '@/app/routes';",
  ],
  ["src/data/connection.ts", "export { useState } from 'react';"],
  [
    "src/pages/ComponentsPage.tsx",
    "export { isTauri } from '@tauri-apps/api/core';",
  ],
  ["src/pages/ComponentsPage.tsx", "export { vi } from 'vitest';"],
  [
    "src/pages/ComponentsPage.tsx",
    "export { renderWithProviders } from '@/tests/render';",
  ],
  [
    "src/data/repositories/exampleRecordRepository.ts",
    "export { resetDatabaseConnectionForTests } from '../connection';",
  ],
  [
    "src/pages/ComponentsPage.tsx",
    "export const deferredImport = import('@/data/connection');",
  ],
])("rejects forbidden imports from %s: %s", async (file, code) => {
  const results = await eslint.lintText(code, {
    filePath: path.join(root, file),
  });
  expect(
    results
      .flatMap((result) => result.messages)
      .some(
        (message) =>
          message.ruleId === "no-restricted-imports" ||
          message.ruleId === "no-restricted-syntax",
      ),
  ).toBe(true);
});

it.each([
  [
    "src/pages/ComponentsPage.tsx",
    "export { ExampleRecordRepository } from '@/data/repositories';",
  ],
  [
    "src/components/layout/AppShell.tsx",
    "export { SettingsPanel } from '@/pages/SettingsPage';",
  ],
  ["src/app/theme.tsx", "export { isTauri } from '@tauri-apps/api/core';"],
  [
    "src/tests/unit/data.test.ts",
    "export { resetDatabaseConnectionForTests } from '@/data/connection';",
  ],
])("allows intended imports from %s", async (file, code) => {
  const results = await eslint.lintText(code, {
    filePath: path.join(root, file),
  });
  expect(
    results
      .flatMap((result) => result.messages)
      .filter(
        (message) =>
          message.ruleId === "no-restricted-imports" ||
          message.ruleId === "no-restricted-syntax" ||
          message.fatal,
      ),
  ).toEqual([]);
});

it("keeps independent database URLs and migration descriptors consistent", () => {
  const rust = readFileSync(path.join(root, "src-tauri/src/lib.rs"), "utf8");
  const rustUrl = /const DATABASE_URL: &str = "([^"]+)"/.exec(rust)?.[1];
  expect(rustUrl).toBe(DATABASE_URL);
  expect(tauriConfig.plugins.sql.preload).toEqual([DATABASE_URL]);
  const descriptors = [
    ...rust.matchAll(
      /Migration\s*\{\s*version:\s*(\d+),\s*description:\s*"([^"]+)"/g,
    ),
  ].map((match) => ({ version: Number(match[1]), description: match[2] }));
  expect(descriptors).toEqual(migrationDescriptors);
});
