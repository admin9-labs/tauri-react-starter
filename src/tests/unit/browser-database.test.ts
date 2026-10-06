import { createBrowserMockDatabase } from "@/data/browserMockDatabase";
import { ExampleRecordRepository } from "@/data/repositories";

it.each([
  ["SELECT missing FROM example_records", []],
  [
    "SELECT id, title, summary, status, created_at, updated_at FROM example_records WHERE title = ?",
    ["title"],
  ],
  ["SELECT COUNT(*) as count FROM example_records", [1]],
] as const)(
  "rejects unsupported select contract: %s",
  async (query, values) => {
    await expect(
      createBrowserMockDatabase().select(query, [...values]),
    ).rejects.toThrow();
  },
);

it("rejects unknown update fields, bad parameter counts and transactions without changing data", async () => {
  const database = createBrowserMockDatabase();
  const repository = new ExampleRecordRepository(() =>
    Promise.resolve(database),
  );
  const record = await repository.create({
    title: "Original",
    summary: "Untouched",
  });
  for (const query of [
    "BEGIN",
    "COMMIT",
    "ROLLBACK",
    "UPDATE example_records SET missing = ? WHERE id = ?",
    "UPDATE example_records SET title = ?, title = ? WHERE id = ?",
  ]) {
    await expect(
      database.execute(query, ["Changed", record.id]),
    ).rejects.toThrow();
  }
  await expect(
    database.execute("UPDATE example_records SET title = ? WHERE id = ?", [
      record.id,
    ]),
  ).rejects.toThrow();
  await expect(
    database.execute("UPDATE example_records SET title = ? WHERE id = ?", [
      null,
      record.id,
    ]),
  ).rejects.toThrow();
  expect(await repository.findById(record.id)).toEqual(record);
});

it("rejects malformed inserts and keeps mock instances independent", async () => {
  const first = createBrowserMockDatabase();
  const second = createBrowserMockDatabase();
  const repository = new ExampleRecordRepository(() => Promise.resolve(first));
  await expect(
    first.execute("INSERT INTO example_records (id, missing) VALUES (?, ?)", [
      "a",
      "b",
    ]),
  ).rejects.toThrow();
  await repository.create({ title: "First only", summary: "Isolated" });
  expect(
    await new ExampleRecordRepository(() => Promise.resolve(second)).count(),
  ).toBe(0);
  await expect(
    second.select(
      "SELECT key, value, updated_at FROM app_metadata ORDER BY key ASC",
    ),
  ).resolves.toEqual([]);
});
