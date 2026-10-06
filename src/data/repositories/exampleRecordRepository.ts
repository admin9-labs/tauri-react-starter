import { getDatabase } from "@/data/connection";
import type { SqlDatabase, SqlValue } from "@/data/sqlDatabase";
import { mapExampleRecordRow } from "@/data/mappers/exampleRecordMapper";
import type { ExampleRecord, ExampleRecordStatus } from "@/types/app";

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function normalizePositiveInteger(value: number, fallback: number): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }
  return Math.max(1, Math.floor(value));
}

type ExampleRecordRow = Parameters<typeof mapExampleRecordRow>[0];

const EXAMPLE_RECORD_SELECT_COLUMNS =
  "id, title, summary, status, created_at, updated_at";

export type ExampleRecordCreateInput = {
  title: string;
  summary: string;
  status?: ExampleRecordStatus;
};

export type ExampleRecordPageInput = {
  page: number;
  pageSize: number;
};

export type ExampleRecordPageResult = {
  items: ExampleRecord[];
  total: number;
  page: number;
  pageSize: number;
};

export class ExampleRecordRepository {
  constructor(
    private readonly databaseFactory: () => Promise<SqlDatabase> = getDatabase,
  ) {}

  async create(input: ExampleRecordCreateInput): Promise<ExampleRecord> {
    const database = await this.databaseFactory();
    const id = generateUUID();
    const now = new Date().toISOString();
    const status = input.status ?? "active";

    await database.execute(
      "INSERT INTO example_records (id, title, summary, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      [id, input.title, input.summary, status, now, now],
    );

    return {
      id,
      title: input.title,
      summary: input.summary,
      status,
      createdAt: now,
      updatedAt: now,
    };
  }

  async seedDefaults(): Promise<ExampleRecord[]> {
    const existingCount = await this.count();
    if (existingCount > 0) {
      return this.findAll();
    }

    const defaults: ExampleRecordCreateInput[] = [
      {
        title: "Application shell",
        summary: "Sidebar navigation, pinned toolbar, settings dialog.",
      },
      {
        title: "SQLite data layer",
        summary: "Tauri SQL plugin, migrations, repository access pattern.",
      },
      {
        title: "Design primitives",
        summary: "Reusable page, surface, table, feedback, and form controls.",
        status: "paused",
      },
    ];

    const created: ExampleRecord[] = [];
    for (const record of defaults) {
      created.push(await this.create(record));
    }
    return created;
  }

  async findAll(): Promise<ExampleRecord[]> {
    const database = await this.databaseFactory();
    const rows = await database.select<ExampleRecordRow[]>(
      `SELECT ${EXAMPLE_RECORD_SELECT_COLUMNS} FROM example_records ORDER BY updated_at DESC`,
    );
    return rows.map(mapExampleRecordRow);
  }

  async findById(id: string): Promise<ExampleRecord | null> {
    const database = await this.databaseFactory();
    const rows = await database.select<ExampleRecordRow[]>(
      `SELECT ${EXAMPLE_RECORD_SELECT_COLUMNS} FROM example_records WHERE id = ?`,
      [id],
    );

    return rows.length > 0 ? mapExampleRecordRow(rows[0]) : null;
  }

  async findPage(
    input: ExampleRecordPageInput,
  ): Promise<ExampleRecordPageResult> {
    const database = await this.databaseFactory();
    const pageSize = normalizePositiveInteger(input.pageSize, 20);
    const requestedPage = normalizePositiveInteger(input.page, 1);
    const total = await this.count();
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const page = total === 0 ? 1 : Math.min(requestedPage, totalPages);
    const offset = (page - 1) * pageSize;

    const rows = await database.select<ExampleRecordRow[]>(
      `SELECT ${EXAMPLE_RECORD_SELECT_COLUMNS} FROM example_records ORDER BY updated_at DESC LIMIT ? OFFSET ?`,
      [pageSize, offset],
    );

    return {
      items: rows.map(mapExampleRecordRow),
      total,
      page,
      pageSize,
    };
  }

  async update(
    id: string,
    updates: Partial<
      Pick<ExampleRecord, "title" | "summary" | "status" | "updatedAt">
    >,
  ): Promise<ExampleRecord | null> {
    const fields: string[] = [];
    const values: SqlValue[] = [];

    if (updates.title !== undefined) {
      fields.push("title = ?");
      values.push(updates.title);
    }
    if (updates.summary !== undefined) {
      fields.push("summary = ?");
      values.push(updates.summary);
    }
    if (updates.status !== undefined) {
      fields.push("status = ?");
      values.push(updates.status);
    }

    fields.push("updated_at = ?");
    values.push(updates.updatedAt ?? new Date().toISOString());

    const database = await this.databaseFactory();
    values.push(id);
    const result = await database.execute(
      `UPDATE example_records SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    if (result.rowsAffected === 0) {
      return null;
    }

    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const database = await this.databaseFactory();
    const result = await database.execute(
      "DELETE FROM example_records WHERE id = ?",
      [id],
    );
    return result.rowsAffected > 0;
  }

  async deleteAll(): Promise<number> {
    const database = await this.databaseFactory();
    const result = await database.execute("DELETE FROM example_records");
    return result.rowsAffected;
  }

  async count(): Promise<number> {
    const database = await this.databaseFactory();
    const rows = await database.select<{ count: number }[]>(
      "SELECT COUNT(*) as count FROM example_records",
    );
    return rows[0]?.count ?? 0;
  }
}
