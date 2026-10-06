import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AppShell } from "@/components/layout/AppShell";
import { routes } from "@/app/routes";
import { renderWithProviders } from "@/tests/render";

function renderShell(activeHash: string = routes.dashboard) {
  return renderWithProviders(
    <AppShell activeHash={activeHash}>
      <div>页面内容</div>
    </AppShell>,
  );
}

describe("AppShell native window layout", () => {
  it.each([
    [routes.dashboard, "概览"],
    [routes.records, "记录"],
    [routes.record("example"), "记录"],
    [routes.components, "组件"],
    ["", "概览"],
    ["#", "概览"],
    ["#/records-extra", "概览"],
    ["#/records/example/extra", "概览"],
    ["#/unknown", "概览"],
  ])("matches the active navigation for %s", (hash, label) => {
    renderShell(hash);

    for (const name of ["概览", "记录", "组件"]) {
      const link = screen.getByRole("link", { name });
      if (name === label) {
        expect(link).toHaveClass("native-sidebar-active");
      } else {
        expect(link).not.toHaveClass("native-sidebar-active");
      }
    }
  });

  it("renders content without a custom web drag overlay", () => {
    renderShell();

    expect(screen.getByText("页面内容")).toBeInTheDocument();
    expect(
      document.querySelector("[data-window-drag-strip]"),
    ).not.toBeInTheDocument();
    expect(
      document.querySelector("[data-tauri-drag-region]"),
    ).not.toBeInTheDocument();
    expect(
      document.querySelector("[data-app-top-divider]"),
    ).toBeInTheDocument();
  });

  it("keeps dashboard and records navigation active states", () => {
    const { unmount } = renderShell();

    expect(screen.getByRole("navigation", { name: "主导航" })).toBeVisible();
    expect(screen.getByRole("link", { name: "概览" })).toHaveClass(
      "native-sidebar-active",
    );
    expect(screen.getByRole("link", { name: "概览" })).toHaveClass(
      "cursor-pointer",
    );
    expect(screen.getByRole("link", { name: "概览" })).toHaveClass(
      "ui-control-interactive",
    );
    expect(screen.getByRole("link", { name: "记录" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "组件" })).toBeInTheDocument();

    unmount();

    const recordsRender = renderShell(routes.records);
    expect(screen.getByRole("link", { name: "记录" })).toHaveClass(
      "native-sidebar-active",
    );

    recordsRender.unmount();

    renderShell(routes.components);
    expect(screen.getByRole("link", { name: "组件" })).toHaveClass(
      "native-sidebar-active",
    );
  });

  it("updates sidebar active state before the hash change is confirmed", () => {
    renderShell(routes.dashboard);
    const link = screen.getByRole("link", { name: "记录" });
    link.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
      },
      { once: true },
    );
    fireEvent.click(link);

    expect(screen.getByRole("link", { name: "记录" })).toHaveClass(
      "native-sidebar-active",
    );
    expect(screen.getByRole("link", { name: "概览" })).not.toHaveClass(
      "native-sidebar-active",
    );
  });

  it("clears confirmed navigation before returning to the previous hash", () => {
    const { rerender } = renderShell(routes.dashboard);
    const link = screen.getByRole("link", { name: "记录" });
    link.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
      },
      { once: true },
    );
    fireEvent.click(link);

    rerender(
      <AppShell activeHash={routes.records}>
        <div>页面内容</div>
      </AppShell>,
    );
    fireEvent(window, new HashChangeEvent("hashchange"));
    rerender(
      <AppShell activeHash={routes.dashboard}>
        <div>页面内容</div>
      </AppShell>,
    );

    expect(screen.getByRole("link", { name: "概览" })).toHaveClass(
      "native-sidebar-active",
    );
    expect(screen.getByRole("link", { name: "记录" })).not.toHaveClass(
      "native-sidebar-active",
    );
  });

  it("opens settings in a dialog", async () => {
    const user = userEvent.setup();
    renderShell();

    expect(screen.getByRole("button", { name: /命令面板/ })).toHaveClass(
      "cursor-pointer",
    );
    expect(screen.getByRole("button", { name: /命令面板/ })).toHaveClass(
      "ui-control-interactive",
    );
    expect(screen.getByRole("button", { name: "设置" })).toHaveClass(
      "cursor-pointer",
    );
    expect(screen.getByRole("button", { name: "设置" })).toHaveClass(
      "ui-control-interactive",
    );

    await user.click(screen.getByRole("button", { name: "设置" }));

    expect(await screen.findByRole("dialog", { name: "设置" })).toBeVisible();
    expect(screen.getByRole("button", { name: "关闭设置弹窗" })).toHaveClass(
      "cursor-pointer",
    );
    expect(
      screen.getByRole("radiogroup", { name: "主题设置" }),
    ).toBeInTheDocument();
  });
});
