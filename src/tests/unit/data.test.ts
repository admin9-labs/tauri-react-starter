import { DATABASE_URL, migrationDescriptors } from "@/data/migrations";
import { mapAppMetadataRow } from "@/data/mappers/appMetadataMapper";
import { ExampleRecordRepository } from "@/data/repositories";
import { resetDatabaseConnectionForTests } from "@/data/connection";

describe("data layer baseline", () => {
  beforeEach(() => {
    resetDatabaseConnectionForTests();
  });

  it("defines the local SQLite database URL", () => {
    expect(DATABASE_URL).toBe("sqlite:desktop-starter.db");
  });

  it("keeps migration descriptors ordered", () => {
    expect(migrationDescriptors.map((migration) => migration.version)).toEqual([
      1, 2,
    ]);
    expect(migrationDescriptors[0].description).toBe("create_app_metadata");
    expect(migrationDescriptors[1].description).toBe("create_example_records");
  });

  it("maps metadata rows away from SQL column names", () => {
    expect(
      mapAppMetadataRow({
        key: "schema",
        value: "starter",
        updated_at: "2026-04-25",
      }),
    ).toEqual({
      key: "schema",
      value: "starter",
      updatedAt: "2026-04-25",
    });
  });

  it("creates, paginates, updates, and deletes example records", async () => {
    const repository = new ExampleRecordRepository();
    const record = await repository.create({
      title: "Template module",
      summary: "Demonstrates repository behavior.",
    });

    const page = await repository.findPage({ page: 1, pageSize: 10 });
    expect(page.total).toBe(1);
    expect(page.items[0].title).toBe("Template module");

    const updated = await repository.update(record.id, {
      status: "paused",
      summary: "Updated summary.",
    });

    expect(updated?.status).toBe("paused");
    expect(updated?.summary).toBe("Updated summary.");

    await expect(repository.delete(record.id)).resolves.toBe(true);
    await expect(repository.count()).resolves.toBe(0);
  });
});

it("returns missing update/delete outcomes without inventing a record", async () => {
  resetDatabaseConnectionForTests();
  const repository = new ExampleRecordRepository();
  await expect(
    repository.update("missing", { title: "Unsaved" }),
  ).resolves.toBeNull();
  await expect(repository.delete("missing")).resolves.toBe(false);
  await expect(repository.count()).resolves.toBe(0);
});

it("paginates the full collection and normalizes page boundaries", async () => {
  resetDatabaseConnectionForTests();
  const repository = new ExampleRecordRepository();
  for (let i = 0; i < 25; i++) {
    const item = await repository.create({
      title: `Entry ${i}`,
      summary: "Pagination fixture",
    });
    await repository.update(item.id, {
      updatedAt: new Date(Date.UTC(2026, 0, i + 1)).toISOString(),
    });
  }
  const first = await repository.findPage({ page: 1, pageSize: 20 });
  const last = await repository.findPage({ page: 99, pageSize: 20 });
  expect(first.items).toHaveLength(20);
  expect(last.items).toHaveLength(5);
  expect(last.page).toBe(2);
  expect(last.total).toBe(25);
  expect(
    new Set([...first.items, ...last.items].map((item) => item.id)).size,
  ).toBe(25);
  expect(
    (await repository.findPage({ page: Number.NaN, pageSize: Number.NaN }))
      .pageSize,
  ).toBe(20);
  expect((await repository.findPage({ page: -1, pageSize: 0 })).page).toBe(1);
  await repository.deleteAll();
  expect(await repository.findPage({ page: 10, pageSize: 20 })).toEqual({
    items: [],
    total: 0,
    page: 1,
    pageSize: 20,
  });
});
