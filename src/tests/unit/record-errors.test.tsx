import { act, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

import { ExampleRecordRepository } from "@/data/repositories";
import { RecordDetailPage } from "@/pages/RecordDetailPage";
import { RecordsPage } from "@/pages/RecordsPage";
import { renderWithProviders } from "@/tests/render";
import type { ExampleRecord } from "@/types/app";

const record: ExampleRecord = {
  id: "record-1",
  title: "Original title",
  summary: "Original summary",
  status: "active",
  createdAt: "2026-10-06T01:00:00.000Z",
  updatedAt: "2026-10-06T01:00:00.000Z",
};

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

describe("record error recovery", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(
      (_message: unknown, error: unknown) => {
        if (
          !(error instanceof Error) ||
          !["read failed", "refresh failed", "save failed"].includes(
            error.message,
          )
        ) {
          throw error;
        }
      },
    );
  });

  afterEach(() => {
    toast.dismiss();
    vi.restoreAllMocks();
  });

  it("keeps an initial list failure visible until retry confirms an empty result", async () => {
    const user = userEvent.setup();
    const retry = deferred<ExampleRecord[]>();
    const findAll = vi
      .spyOn(ExampleRecordRepository.prototype, "findAll")
      .mockRejectedValueOnce(new Error("read failed"))
      .mockReturnValueOnce(retry.promise);

    renderWithProviders(<RecordsPage />);

    expect(await screen.findByRole("alert")).toHaveTextContent("记录加载失败");
    expect(screen.queryByText("暂无记录")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "重试" }));

    expect(screen.getByRole("button", { name: "重试中..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "刷新" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "生成示例" })).toBeDisabled();
    expect(screen.getByRole("alert")).toHaveTextContent("记录加载失败");
    expect(screen.queryByText("暂无记录")).not.toBeInTheDocument();

    await act(async () => {
      retry.resolve([]);
      await retry.promise;
    });

    expect(await screen.findByText("暂无记录")).toBeVisible();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(findAll).toHaveBeenCalledTimes(2);
  });

  it("retains the last list result after a refresh fails and clears the error on retry", async () => {
    const user = userEvent.setup();
    vi.spyOn(ExampleRecordRepository.prototype, "findAll")
      .mockResolvedValueOnce([record])
      .mockRejectedValueOnce(new Error("refresh failed"))
      .mockResolvedValueOnce([{ ...record, title: "Fresh title" }]);

    renderWithProviders(<RecordsPage />);
    await screen.findByRole("link", { name: /Original title/ });
    await user.click(screen.getByRole("button", { name: "刷新" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "刷新失败，当前显示上次结果",
    );
    expect(screen.getByRole("link", { name: /Original title/ })).toBeVisible();
    expect(screen.queryByText("暂无记录")).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "重试" })).toBeEnabled();
    });
    await user.click(screen.getByRole("button", { name: "重试" }));

    expect(
      await screen.findByRole("link", { name: /Fresh title/ }),
    ).toBeVisible();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Original title/ })).toBeNull();
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "刷新" })).toBeEnabled();
    });
  });

  it("distinguishes a detail read failure from a missing record and retries", async () => {
    const user = userEvent.setup();
    const retry = deferred<ExampleRecord | null>();
    const findById = vi
      .spyOn(ExampleRecordRepository.prototype, "findById")
      .mockRejectedValueOnce(new Error("read failed"))
      .mockReturnValueOnce(retry.promise);

    renderWithProviders(<RecordDetailPage recordId={record.id} />);

    expect(await screen.findByRole("alert")).toHaveTextContent("记录加载失败");
    expect(screen.queryByText("记录不存在")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "重试" }));
    expect(screen.getByRole("button", { name: "重试中..." })).toBeDisabled();
    expect(screen.getByRole("alert")).toHaveTextContent("记录加载失败");

    await act(async () => {
      retry.resolve(record);
      await retry.promise;
    });

    expect(
      await screen.findByRole("heading", { name: record.title }),
    ).toBeVisible();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(findById).toHaveBeenCalledTimes(2);
  });

  it("shows not-found only after a successful detail query returns null", async () => {
    const user = userEvent.setup();
    vi.spyOn(ExampleRecordRepository.prototype, "findById")
      .mockRejectedValueOnce(new Error("read failed"))
      .mockResolvedValueOnce(null);

    renderWithProviders(<RecordDetailPage recordId={record.id} />);
    await screen.findByRole("alert");
    expect(screen.queryByText("记录不存在")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "重试" }));

    expect(await screen.findByText("记录不存在")).toBeVisible();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("keeps every edit when update returns null and provides a return link", async () => {
    const user = userEvent.setup();
    vi.spyOn(ExampleRecordRepository.prototype, "findById").mockResolvedValue(
      record,
    );
    vi.spyOn(ExampleRecordRepository.prototype, "update").mockResolvedValue(
      null,
    );

    renderWithProviders(<RecordDetailPage recordId={record.id} />);
    await user.click(await screen.findByRole("button", { name: "编辑记录" }));
    await user.clear(screen.getByLabelText("标题"));
    await user.type(screen.getByLabelText("标题"), "Unsaved title");
    await user.clear(screen.getByLabelText("摘要"));
    await user.type(screen.getByLabelText("摘要"), "Unsaved summary");
    await user.selectOptions(screen.getByLabelText("状态"), "paused");
    await user.click(screen.getByRole("button", { name: "保存" }));

    const error = await screen.findByRole("alert");
    expect(error).toHaveTextContent("记录已不存在，此次未保存");
    expect(
      within(error).getByRole("link", { name: "返回列表" }),
    ).toHaveAttribute("href", "#/records");
    expect(screen.getByLabelText("标题")).toHaveValue("Unsaved title");
    expect(screen.getByLabelText("摘要")).toHaveValue("Unsaved summary");
    expect(screen.getByLabelText("状态")).toHaveValue("paused");
    expect(screen.queryByText("记录已保存")).not.toBeInTheDocument();
  });

  it("retains a failed save and only reports success after a retry returns a record", async () => {
    const user = userEvent.setup();
    const retry = deferred<ExampleRecord | null>();
    vi.spyOn(ExampleRecordRepository.prototype, "findById").mockResolvedValue(
      record,
    );
    const update = vi
      .spyOn(ExampleRecordRepository.prototype, "update")
      .mockRejectedValueOnce(new Error("save failed"))
      .mockReturnValueOnce(retry.promise);

    renderWithProviders(<RecordDetailPage recordId={record.id} />);
    await user.click(await screen.findByRole("button", { name: "编辑记录" }));
    await user.clear(screen.getByLabelText("标题"));
    await user.type(screen.getByLabelText("标题"), "Retained title");
    await user.click(screen.getByRole("button", { name: "保存" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("保存失败");
    expect(screen.getByLabelText("标题")).toHaveValue("Retained title");
    expect(screen.queryByText("记录已保存")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "保存" }));
    expect(screen.getByRole("button", { name: "保存中..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "取消" })).toBeDisabled();
    expect(screen.getByRole("alert")).toHaveTextContent("保存失败");

    await act(async () => {
      retry.resolve({ ...record, title: "Retained title" });
      await retry.promise;
    });

    expect(await screen.findByText("记录已保存")).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Retained title" }),
    ).toBeVisible();
    expect(screen.queryByLabelText("标题")).not.toBeInTheDocument();
    expect(screen.queryByText("保存失败")).not.toBeInTheDocument();
    expect(update).toHaveBeenCalledTimes(2);
    await user.click(screen.getByRole("button", { name: "编辑记录" }));
    expect(screen.queryByText("保存失败")).not.toBeInTheDocument();
  });

  it("keeps a second successful save visible after the previous toast finishes exiting", async () => {
    const user = userEvent.setup();
    const secondSave = deferred<ExampleRecord | null>();
    vi.spyOn(ExampleRecordRepository.prototype, "findById").mockResolvedValue(
      record,
    );
    vi.spyOn(ExampleRecordRepository.prototype, "update")
      .mockResolvedValueOnce({ ...record, title: "First saved title" })
      .mockReturnValueOnce(secondSave.promise);

    renderWithProviders(<RecordDetailPage recordId={record.id} />);
    await user.click(await screen.findByRole("button", { name: "编辑记录" }));
    await user.click(screen.getByRole("button", { name: "保存" }));
    const previousToast = (await screen.findByText("记录已保存")).closest(
      "[data-sonner-toast]",
    );

    await user.click(screen.getByRole("button", { name: "编辑记录" }));
    await user.click(screen.getByRole("button", { name: "保存" }));
    await waitFor(() => {
      expect(previousToast).toHaveAttribute("data-removed", "true");
    });
    expect(previousToast).toBeInTheDocument();

    await act(async () => {
      secondSave.resolve({ ...record, title: "Second saved title" });
      await secondSave.promise;
    });

    expect(
      await screen.findByRole("heading", { name: "Second saved title" }),
    ).toBeVisible();
    await waitFor(() => {
      expect(previousToast).not.toBeInTheDocument();
    });
    const currentToast = await screen.findByText("记录已保存");
    expect(currentToast).toBeVisible();
    expect(currentToast.closest("[data-sonner-toast]")).toHaveAttribute(
      "data-removed",
      "false",
    );
    expect(screen.queryByLabelText("标题")).not.toBeInTheDocument();
  });

  it.each(["missing", "failed"])(
    "dismisses a previous success before a subsequent %s save and does not publish it again",
    async (failure) => {
      const user = userEvent.setup();
      const successToast = vi.spyOn(toast, "success");
      const dismissToast = vi.spyOn(toast, "dismiss");
      vi.spyOn(ExampleRecordRepository.prototype, "findById").mockResolvedValue(
        record,
      );
      const update = vi
        .spyOn(ExampleRecordRepository.prototype, "update")
        .mockResolvedValueOnce({ ...record, title: "Saved title" });
      if (failure === "missing") {
        update.mockResolvedValueOnce(null);
      } else {
        update.mockRejectedValueOnce(new Error("save failed"));
      }

      renderWithProviders(<RecordDetailPage recordId={record.id} />);
      await user.click(await screen.findByRole("button", { name: "编辑记录" }));
      await user.clear(screen.getByLabelText("标题"));
      await user.type(screen.getByLabelText("标题"), "Saved title");
      await user.click(screen.getByRole("button", { name: "保存" }));
      expect(await screen.findByText("记录已保存")).toBeVisible();
      expect(successToast).toHaveBeenCalledTimes(1);
      const previousToastId = successToast.mock.calls[0]?.[1]?.id;
      expect(previousToastId).toBeTypeOf("string");

      await user.click(screen.getByRole("button", { name: "编辑记录" }));
      await user.clear(screen.getByLabelText("标题"));
      await user.type(screen.getByLabelText("标题"), "Unsaved second edit");
      expect(successToast).toHaveBeenCalledTimes(1);
      dismissToast.mockClear();
      await user.click(screen.getByRole("button", { name: "保存" }));

      expect(await screen.findByRole("alert")).toHaveTextContent(
        failure === "missing" ? "记录已不存在，此次未保存" : "保存失败",
      );
      expect(screen.getByLabelText("标题")).toHaveValue("Unsaved second edit");
      expect(dismissToast).toHaveBeenCalledExactlyOnceWith(previousToastId);
      await waitFor(() => {
        expect(screen.queryByText("记录已保存")).not.toBeInTheDocument();
      });
      expect(successToast).toHaveBeenCalledTimes(1);
    },
  );

  it.each(["missing", "failed"])(
    "clears the %s save error and restores persisted fields when cancelling",
    async (failure) => {
      const user = userEvent.setup();
      vi.spyOn(ExampleRecordRepository.prototype, "findById").mockResolvedValue(
        record,
      );
      const update = vi.spyOn(ExampleRecordRepository.prototype, "update");
      if (failure === "missing") {
        update.mockResolvedValue(null);
      } else {
        update.mockRejectedValue(new Error("save failed"));
      }

      renderWithProviders(<RecordDetailPage recordId={record.id} />);
      await user.click(await screen.findByRole("button", { name: "编辑记录" }));
      await user.clear(screen.getByLabelText("标题"));
      await user.type(screen.getByLabelText("标题"), "Discarded edit");
      await user.click(screen.getByRole("button", { name: "保存" }));
      await screen.findByRole("alert");
      await user.click(screen.getByRole("button", { name: "取消" }));

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "编辑记录" }));
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(screen.getByLabelText("标题")).toHaveValue(record.title);
    },
  );
});
