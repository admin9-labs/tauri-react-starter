import type { ExampleRecordRow } from "./mappers/exampleRecordMapper";
import type { SqlDatabase, SqlValue } from "./sqlDatabase";

const columns = "id, title, summary, status, created_at, updated_at";
const selectRecords = `select ${columns} from example_records`;

function requireParameters(values: SqlValue[], count: number) {
  if (values.length !== count) {
    throw new Error(
      `Expected ${count} mock SQL parameters, received ${values.length}`,
    );
  }
}

function stringParameter(value: SqlValue | undefined): string {
  if (typeof value !== "string") {
    throw new Error("Expected a string mock SQL parameter");
  }
  return value;
}

function integerParameter(value: SqlValue | undefined): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    throw new Error("Expected a non-negative integer mock SQL parameter");
  }
  return value;
}

export function createBrowserMockDatabase(): SqlDatabase {
  let records: ExampleRecordRow[] = [];

  return {
    async execute(query, values = []) {
      const sql = query.replace(/\s+/g, " ").trim().toLowerCase();
      await Promise.resolve();

      if (
        sql ===
        `insert into example_records (${columns}) values (?, ?, ?, ?, ?, ?)`
      ) {
        requireParameters(values, 6);
        const [id, title, summary, status, createdAt, updatedAt] =
          values.map(stringParameter);
        if (records.some((row) => row.id === id)) {
          throw new Error("Duplicate mock example record ID");
        }
        records.push({
          id,
          title,
          summary,
          status,
          created_at: createdAt,
          updated_at: updatedAt,
        });
        return { rowsAffected: 1 };
      }

      const update = /^update example_records set (.+) where id = \?$/.exec(
        sql,
      );
      if (update) {
        const assignments = update[1].split(", ");
        const fields = assignments.map((assignment) => {
          const match = /^(title|summary|status|updated_at) = \?$/.exec(
            assignment,
          );
          if (!match) {
            throw new Error(`Unsupported mock update field: ${assignment}`);
          }
          return match[1];
        });
        if (new Set(fields).size !== fields.length) {
          throw new Error("Duplicate mock update field");
        }
        requireParameters(values, fields.length + 1);
        const strings = values.map(stringParameter);
        const target = records.find((row) => row.id === strings[fields.length]);
        if (!target) {
          return { rowsAffected: 0 };
        }
        fields.forEach((field, index) => {
          const value = strings[index];
          if (field === "title") target.title = value;
          else if (field === "summary") target.summary = value;
          else if (field === "status") target.status = value;
          else if (field === "updated_at") target.updated_at = value;
        });
        return { rowsAffected: 1 };
      }

      if (sql === "delete from example_records where id = ?") {
        requireParameters(values, 1);
        const id = stringParameter(values[0]);
        const before = records.length;
        records = records.filter((row) => row.id !== id);
        return { rowsAffected: before - records.length };
      }
      if (sql === "delete from example_records") {
        requireParameters(values, 0);
        const count = records.length;
        records = [];
        return { rowsAffected: count };
      }
      throw new Error(`Unsupported mock execute query: ${query}`);
    },

    async select<Rows extends object[]>(
      query: string,
      values: SqlValue[] = [],
    ): Promise<Rows> {
      const sql = query.replace(/\s+/g, " ").trim().toLowerCase();
      await Promise.resolve();
      const sorted = [...records].sort((a, b) =>
        b.updated_at.localeCompare(a.updated_at),
      );
      let result: object[];
      if (sql === "select count(*) as count from example_records") {
        requireParameters(values, 0);
        result = [{ count: records.length }];
      } else if (sql === `${selectRecords} where id = ?`) {
        requireParameters(values, 1);
        const id = stringParameter(values[0]);
        result = sorted.filter((row) => row.id === id);
      } else if (sql === `${selectRecords} order by updated_at desc`) {
        requireParameters(values, 0);
        result = sorted;
      } else if (
        sql === `${selectRecords} order by updated_at desc limit ? offset ?`
      ) {
        requireParameters(values, 2);
        const limit = integerParameter(values[0]);
        const offset = integerParameter(values[1]);
        result = sorted.slice(offset, offset + limit);
      } else if (
        sql ===
        "select key, value, updated_at from app_metadata order by key asc"
      ) {
        requireParameters(values, 0);
        result = [];
      } else {
        throw new Error(`Unsupported mock select query: ${query}`);
      }
      // SQL result shapes cannot be inferred from the caller's query string.
      return result.map((row) => ({ ...row })) as Rows;
    },
  };
}
