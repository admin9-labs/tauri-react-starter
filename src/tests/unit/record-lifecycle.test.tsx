import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

import { App } from "@/app/App";
import { routes } from "@/app/routes";
import { resetDatabaseConnectionForTests } from "@/data/connection";
import { ExampleRecordRepository } from "@/data/repositories";
import { RecordDetailPage } from "@/pages/RecordDetailPage";
import { RecordsPage } from "@/pages/RecordsPage";
import { ComponentsPage } from "@/pages/ComponentsPage";
import { renderWithProviders } from "@/tests/render";
import type { ExampleRecord } from "@/types/app";

function record(id: string): ExampleRecord {
  return {
    id,
    title: `Record ${id}`,
    summary: `Summary ${id}`,
    status: "active",
    createdAt: "2026-10-06T00:00:00Z",
    updatedAt: "2026-10-06T00:00:00Z",
  };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

function navigate(id: string) {
  window.history.replaceState(null, "", routes.record(id));
  fireEvent(window, new HashChangeEvent("hashchange"));
}

beforeEach(() => {
  resetDatabaseConnectionForTests();
  window.localStorage.clear();
  window.history.replaceState(null, "", routes.record("A"));
});

afterEach(() => {
  toast.dismiss();
  vi.restoreAllMocks();
});

it.each(["success", "failure"])(
  "ignores an obsolete detail read %s and saves only B's fields",
  async (outcome) => {
    const user = userEvent.setup();
    const oldRead = deferred<ExampleRecord | null>();
    vi.spyOn(ExampleRecordRepository.prototype, "findById").mockImplementation(
      (id) => (id === "A" ? oldRead.promise : Promise.resolve(record(id))),
    );
    const update = vi
      .spyOn(ExampleRecordRepository.prototype, "update")
      .mockResolvedValue(record("B"));
    const view = renderWithProviders(<RecordDetailPage recordId="A" />);
    view.rerender(<RecordDetailPage recordId="B" />);
    await screen.findByRole("heading", { name: "Record B" });
    await act(async () => {
      if (outcome === "success") oldRead.resolve(record("A"));
      else oldRead.reject(new Error("obsolete failure"));
      await oldRead.promise.catch(() => undefined);
    });
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByRole("heading", { name: "Record B" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "编辑记录" }));
    await user.click(screen.getByRole("button", { name: "保存" }));
    expect(update).toHaveBeenCalledExactlyOnceWith("B", {
      title: "Record B",
      summary: "Summary B",
      status: "active",
    });
  },
);

it("resets draft and edit mode when the app switches record identity", async () => {
  const user = userEvent.setup();
  vi.spyOn(ExampleRecordRepository.prototype, "findById").mockImplementation(
    (id) => Promise.resolve(record(id)),
  );
  renderWithProviders(<App />);
  await user.click(await screen.findByRole("button", { name: "编辑记录" }));
  await user.type(screen.getByLabelText("标题"), " draft");
  navigate("B");
  await screen.findByRole("heading", { name: "Record B" });
  expect(screen.queryByLabelText("标题")).toBeNull();
  await user.click(screen.getByRole("button", { name: "编辑记录" }));
  expect(screen.getByLabelText("标题")).toHaveValue("Record B");
});

it.each(["success", "failure"])(
  "does not publish an obsolete save %s on another record",
  async (outcome) => {
    const user = userEvent.setup();
    const save = deferred<ExampleRecord | null>();
    vi.spyOn(ExampleRecordRepository.prototype, "findById").mockImplementation(
      (id) => Promise.resolve(record(id)),
    );
    const update = vi
      .spyOn(ExampleRecordRepository.prototype, "update")
      .mockReturnValue(save.promise);
    renderWithProviders(<App />);
    await user.click(await screen.findByRole("button", { name: "编辑记录" }));
    await user.click(screen.getByRole("button", { name: "保存" }));
    navigate("B");
    await screen.findByRole("heading", { name: "Record B" });
    await act(async () => {
      if (outcome === "success") save.resolve(record("A"));
      else save.reject(new Error("obsolete save failure"));
      await save.promise.catch(() => undefined);
    });
    expect(update.mock.calls[0]?.[0]).toBe("A");
    expect(screen.getByRole("heading", { name: "Record B" })).toBeVisible();
    expect(screen.queryByText("记录已保存")).toBeNull();
    expect(screen.queryByRole("alert")).toBeNull();
  },
);

it("does not navigate away from B when A's deletion completes", async () => {
  const user = userEvent.setup();
  const deletion = deferred<boolean>();
  vi.spyOn(ExampleRecordRepository.prototype, "findById").mockImplementation(
    (id) => Promise.resolve(record(id)),
  );
  const remove = vi
    .spyOn(ExampleRecordRepository.prototype, "delete")
    .mockReturnValue(deletion.promise);
  renderWithProviders(<App />);
  await user.click(await screen.findByRole("button", { name: "删除记录" }));
  await user.click(screen.getByRole("button", { name: "删除" }));
  navigate("B");
  await screen.findByRole("heading", { name: "Record B" });
  await act(async () => {
    deletion.resolve(true);
    await deletion.promise;
  });
  expect(remove).toHaveBeenCalledExactlyOnceWith("A");
  expect(window.location.hash).toBe(routes.record("B"));
  expect(screen.getByRole("heading", { name: "Record B" })).toBeVisible();
});

it("shows and filters records beyond the former first page", async () => {
  const repository = new ExampleRecordRepository();
  const older = await repository.create({
    title: "Older paused",
    summary: "Beyond first page",
    status: "paused",
  });
  await repository.update(older.id, { updatedAt: "2020-01-01T00:00:00Z" });
  for (let i = 0; i < 24; i++)
    await repository.create({ title: `Entry ${i}`, summary: "Active fixture" });
  const user = userEvent.setup();
  const view = renderWithProviders(<RecordsPage />);
  await screen.findByRole("link", { name: /Older paused/ });
  expect(
    view.container.querySelectorAll('[data-slot="record-list-item"]'),
  ).toHaveLength(25);
  expect(screen.getByRole("button", { name: /全部记录/ })).toHaveTextContent(
    "25",
  );
  expect(screen.getByRole("button", { name: /暂停/ })).toHaveTextContent("1");
  await user.click(screen.getByRole("button", { name: /暂停/ }));
  expect(screen.getByRole("link", { name: /Older paused/ })).toBeVisible();
  expect(
    view.container.querySelectorAll('[data-slot="record-list-item"]'),
  ).toHaveLength(1);
});

it("does not republish list feedback when selection changes", async () => {
  const user = userEvent.setup();
  const success = vi.spyOn(toast, "success");
  renderWithProviders(<RecordsPage />);
  await screen.findByText("暂无记录");
  await user.click(screen.getAllByRole("button", { name: "生成示例" })[0]);
  await screen.findByRole("link", { name: /Application shell/ });
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "刷新" })).toBeEnabled(),
  );
  expect(success).toHaveBeenCalledTimes(1);
  await user.click(screen.getByRole("button", { name: /暂停/ }));
  await user.hover(screen.getByRole("link", { name: /Design primitives/ }));
  expect(success).toHaveBeenCalledTimes(1);
});

it("does not republish component feedback after an unrelated modal state change", async () => {
  const user = userEvent.setup();
  const success = vi.spyOn(toast, "success");
  renderWithProviders(<ComponentsPage />);
  await user.click(screen.getByRole("button", { name: "触发提示" }));
  await screen.findByText("UI Lab 已刷新");
  await user.click(screen.getByRole("button", { name: "打开弹窗" }));
  expect(success).toHaveBeenCalledTimes(1);
});

it("keeps refresh actions disabled until both the request and loading timer finish", async () => {
  const refresh = deferred<ExampleRecord[]>();
  vi.spyOn(ExampleRecordRepository.prototype, "findAll")
    .mockResolvedValueOnce([record("A")])
    .mockReturnValueOnce(refresh.promise);
  renderWithProviders(<RecordsPage />);
  await screen.findByRole("link", { name: /Record A/ });
  vi.useFakeTimers();
  try {
    fireEvent.click(screen.getByRole("button", { name: "刷新" }));
    expect(screen.getByRole("button", { name: "刷新中..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "生成示例" })).toBeDisabled();
    await act(async () => {
      refresh.resolve([record("B")]);
      await refresh.promise;
    });
    expect(screen.getByRole("button", { name: "刷新中..." })).toBeDisabled();
    await act(async () => {
      await vi.runOnlyPendingTimersAsync();
    });
    expect(screen.getByRole("button", { name: "刷新" })).toBeEnabled();
    expect(screen.getByRole("link", { name: /Record B/ })).toBeVisible();
  } finally {
    vi.useRealTimers();
  }
});
