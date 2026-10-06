import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { App } from "@/app/App";
import { themeStorageKey } from "@/app/theme";
import { resetDatabaseConnectionForTests } from "@/data/connection";
import { renderWithProviders } from "@/tests/render";

function renderApp() {
  return renderWithProviders(<App />);
}

describe("App skeleton", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.location.hash = "#/dashboard";
    resetDatabaseConnectionForTests();
  });

  it("shows the reusable dashboard and shell navigation", () => {
    renderApp();

    expect(screen.getByRole("heading", { name: "概览" })).toBeInTheDocument();
    expect(screen.getByText("干净的本地桌面工具骨架")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "概览" })).toHaveClass(
      "native-sidebar-active",
    );
    expect(screen.getByRole("link", { name: "记录" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "组件" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "设置" })).toBeInTheDocument();
  });

  it("opens the UI Lab components route", () => {
    window.location.hash = "#/components";
    renderApp();

    expect(screen.getByRole("heading", { name: "组件" })).toBeInTheDocument();
    expect(screen.getByText("项目内组件样板")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "组件" })).toHaveClass(
      "native-sidebar-active",
    );
  });

  it("seeds example records and opens a detail page", async () => {
    const user = userEvent.setup();
    window.location.hash = "#/records";
    renderApp();

    expect(await screen.findByRole("heading", { name: "记录" })).toBeVisible();
    expect(await screen.findByText("暂无记录")).toBeInTheDocument();

    await user.click(screen.getAllByRole("button", { name: "生成示例" })[0]);

    expect(await screen.findAllByText("3")).toHaveLength(1);
    expect(screen.getByText("3 条记录")).toBeInTheDocument();
    expect(await screen.findByText("Record Inspector")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /全部记录/ })).toHaveClass(
      "cursor-pointer",
    );
    expect(screen.getByRole("button", { name: /全部记录/ })).toHaveClass(
      "ui-control-interactive",
    );
    expect(screen.getByRole("link", { name: /Application shell/ })).toHaveClass(
      "cursor-pointer",
    );
    await user.click(screen.getByRole("link", { name: /Application shell/ }));

    expect(
      await screen.findByRole("heading", { name: "记录详情" }),
    ).toBeVisible();
    expect(
      screen.getByText("Sidebar navigation, pinned toolbar, settings dialog."),
    ).toBeInTheDocument();
  });

  it("edits and deletes an example record", async () => {
    const user = userEvent.setup();
    window.location.hash = "#/records";
    renderApp();

    await screen.findByText("暂无记录");
    await user.click(screen.getAllByRole("button", { name: "生成示例" })[0]);
    await user.click(
      await screen.findByRole("link", { name: /Application shell/ }),
    );
    await user.click(await screen.findByRole("button", { name: "编辑记录" }));

    expect(screen.getByLabelText("状态")).toHaveClass("cursor-pointer");

    await user.clear(screen.getByLabelText("标题"));
    await user.type(screen.getByLabelText("标题"), "Starter shell");
    await user.click(screen.getByRole("button", { name: "保存" }));

    expect(await screen.findByText("记录已保存")).toBeInTheDocument();
    expect(screen.getAllByText("Starter shell")).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: "删除记录" }));
    expect(
      await screen.findByRole("dialog", { name: "删除记录" }),
    ).toBeVisible();
    await user.click(screen.getByRole("button", { name: "删除" }));

    await waitFor(() => {
      expect(window.location.hash).toBe("#/records");
    });
  });

  it("opens settings and persists theme choices", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole("button", { name: "设置" }));
    expect(await screen.findByRole("dialog", { name: "设置" })).toBeVisible();
    expect(screen.getByRole("radio", { name: "浅色" })).toHaveClass(
      "cursor-pointer",
    );
    expect(screen.getByRole("radio", { name: "浅色" })).toHaveClass(
      "ui-control-interactive",
    );

    await user.click(screen.getByText("浅色", { exact: true }));

    expect(window.localStorage.getItem(themeStorageKey)).toBe("light");
  });
});
