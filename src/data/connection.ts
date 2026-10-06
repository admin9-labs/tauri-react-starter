import Database from "@tauri-apps/plugin-sql";
import { isTauri } from "@tauri-apps/api/core";

import { createBrowserMockDatabase } from "./browserMockDatabase";
import { DATABASE_URL } from "./migrations";
import type { SqlDatabase } from "./sqlDatabase";

let databasePromise: Promise<SqlDatabase> | null = null;
let browserDatabasePromise: Promise<SqlDatabase> | null = null;

export function getDatabase(): Promise<SqlDatabase> {
  if (!isTauri()) {
    browserDatabasePromise ??= Promise.resolve(createBrowserMockDatabase());
    return browserDatabasePromise;
  }

  databasePromise ??= Database.load(DATABASE_URL).catch((error: unknown) => {
    databasePromise = null;
    throw error;
  });
  return databasePromise;
}

export function resetDatabaseConnectionForTests() {
  databasePromise = null;
  browserDatabasePromise = null;
}
