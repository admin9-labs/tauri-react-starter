import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "@/app/App";
import { themeStorageKey } from "@/app/theme";
import { renderWithProviders } from "@/tests/render";

function renderApp() {
  return renderWithProviders(<App />);
}

describe("App skeleton", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.location.hash = "#/dashboard";
  });
  it("shows the reusable dashboard and shell navigation", () => {
    renderApp();

    expect(screen.getByRole("heading", { name: "概览" })).toBeInTheDocument();
    expect(screen.getByText("干净的本地桌面工具骨架")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "概览" })).toHaveClass(
      "native-sidebar-active",
    );
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
