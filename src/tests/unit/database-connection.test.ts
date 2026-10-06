import {
  getDatabase,
  resetDatabaseConnectionForTests,
} from "@/data/connection";
import { DATABASE_URL } from "@/data/migrations";
import { ExampleRecordRepository } from "@/data/repositories";

const sqlMock = vi.hoisted(() => ({
  load: vi.fn<(path: string) => Promise<unknown>>(),
  execute:
    vi.fn<
      (query: string, values?: unknown[]) => Promise<{ rowsAffected: number }>
    >(),
  select: vi.fn<(query: string, values?: unknown[]) => Promise<unknown[]>>(),
}));

vi.mock("@tauri-apps/plugin-sql", () => ({
  default: { load: sqlMock.load },
}));

describe("database runtime selection", () => {
  const nativeDatabase = {
    execute: sqlMock.execute,
    select: sqlMock.select,
  };

  beforeEach(() => {
    resetDatabaseConnectionForTests();
    vi.stubGlobal("isTauri", false);
    sqlMock.load.mockReset().mockResolvedValue(nativeDatabase);
    sqlMock.execute.mockReset().mockResolvedValue({ rowsAffected: 1 });
    sqlMock.select.mockReset().mockResolvedValue([]);
  });

  afterEach(() => {
    resetDatabaseConnectionForTests();
    vi.unstubAllGlobals();
  });

  it("keeps browser CRUD in the cached mock without loading the plugin", async () => {
    const firstConnection = getDatabase();
    expect(getDatabase()).toBe(firstConnection);

    const repository = new ExampleRecordRepository();
    const record = await repository.create({
      title: "Browser example",
      summary: "In-memory preview data",
    });

    expect(await repository.findById(record.id)).toEqual(record);
    expect(sqlMock.load).not.toHaveBeenCalled();
    expect(sqlMock.execute).not.toHaveBeenCalled();
  });

  it("loads and caches the native database without the global Tauri API", async () => {
    vi.stubGlobal("isTauri", true);
    expect(window).not.toHaveProperty("__TAURI__");

    const firstConnection = getDatabase();
    expect(getDatabase()).toBe(firstConnection);
    await expect(firstConnection).resolves.toBe(nativeDatabase);
    expect(sqlMock.load).toHaveBeenCalledExactlyOnceWith(DATABASE_URL);
  });

  it("does not treat a global API object as a native runtime marker", async () => {
    vi.stubGlobal("__TAURI__", {});

    const database = await getDatabase();
    expect(database).not.toBe(nativeDatabase);
    expect(sqlMock.load).not.toHaveBeenCalled();
  });

  it("shares a failed native attempt and allows the next call to reconnect", async () => {
    vi.stubGlobal("isTauri", true);
    const failure = new Error("Native database unavailable");
    sqlMock.load.mockRejectedValueOnce(failure);

    const firstConnection = getDatabase();
    expect(getDatabase()).toBe(firstConnection);
    await Promise.all([
      expect(firstConnection).rejects.toBe(failure),
      expect(new ExampleRecordRepository().count()).rejects.toBe(failure),
    ]);
    expect(sqlMock.load).toHaveBeenCalledExactlyOnceWith(DATABASE_URL);
    expect(sqlMock.select).not.toHaveBeenCalled();

    const retryConnection = getDatabase();
    expect(retryConnection).not.toBe(firstConnection);
    expect(getDatabase()).toBe(retryConnection);
    await expect(retryConnection).resolves.toBe(nativeDatabase);
    expect(getDatabase()).toBe(retryConnection);
    expect(sqlMock.load).toHaveBeenCalledTimes(2);
  });

  it("passes parameterized repository writes and reads to the native plugin", async () => {
    vi.stubGlobal("isTauri", true);
    const repository = new ExampleRecordRepository();
    const record = await repository.create({
      title: "Native record's title",
      summary: "Stored through the SQL plugin",
    });

    expect(sqlMock.execute).toHaveBeenCalledExactlyOnceWith(
      "INSERT INTO example_records (id, title, summary, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      [
        record.id,
        record.title,
        record.summary,
        record.status,
        record.createdAt,
        record.updatedAt,
      ],
    );

    sqlMock.select.mockResolvedValue([
      {
        id: record.id,
        title: record.title,
        summary: record.summary,
        status: record.status,
        created_at: record.createdAt,
        updated_at: record.updatedAt,
      },
    ]);

    await expect(repository.findById(record.id)).resolves.toEqual(record);
    expect(sqlMock.select).toHaveBeenCalledExactlyOnceWith(
      "SELECT id, title, summary, status, created_at, updated_at FROM example_records WHERE id = ?",
      [record.id],
    );
    expect(sqlMock.load).toHaveBeenCalledExactlyOnceWith(DATABASE_URL);
  });
});
