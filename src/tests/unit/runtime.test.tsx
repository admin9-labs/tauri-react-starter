import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SettingsPanel } from "@/pages/SettingsPage";
import { getTauriWindowMock } from "@/tests/setup";
import { renderWithProviders } from "@/tests/render";

beforeEach(() => {
  window.localStorage.clear();
  getTauriWindowMock().setTheme.mockClear();
  getTauriWindowMock().theme.mockClear();
});
afterEach(() => vi.unstubAllGlobals());

it("keeps browser theme changes away from native window calls", async () => {
  vi.stubGlobal("isTauri", false);
  const user = userEvent.setup();
  renderWithProviders(<SettingsPanel />);
  await user.click(screen.getByRole("radio", { name: "浅色" }));
  expect(document.documentElement.dataset.theme).toBe("light");
  expect(getTauriWindowMock().setTheme).not.toHaveBeenCalled();
});

it("uses the official runtime flag for native system and explicit themes", async () => {
  vi.stubGlobal("isTauri", true);
  const user = userEvent.setup();
  await act(() => {
    renderWithProviders(<SettingsPanel />);
    return Promise.resolve();
  });
  expect(getTauriWindowMock().setTheme).toHaveBeenCalledWith(null);
  expect(getTauriWindowMock().theme).toHaveBeenCalled();
  await user.click(screen.getByRole("radio", { name: "浅色" }));
  expect(getTauriWindowMock().setTheme).toHaveBeenCalledWith("light");
});
