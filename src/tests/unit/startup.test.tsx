import { render } from "@testing-library/react";
import { isValidElement } from "react";
import ReactDOM from "react-dom/client";

import { getTauriWindowMock } from "@/tests/setup";

it("shows the native window only when the official runtime flag is enabled", async () => {
  const root = document.createElement("div");
  root.id = "root";
  document.body.append(root);
  const capturedRender = vi.fn<(node: React.ReactNode) => void>();
  const createRoot = vi
    .spyOn(ReactDOM, "createRoot")
    .mockReturnValue({ render: capturedRender, unmount: vi.fn() });
  getTauriWindowMock().show.mockClear();
  try {
    await import("@/main");
    createRoot.mockRestore();
    const element = capturedRender.mock.calls[0]?.[0];
    if (!isValidElement(element))
      throw new Error("Startup did not render a React element");
    vi.stubGlobal("isTauri", false);
    const browser = render(element);
    expect(getTauriWindowMock().show).not.toHaveBeenCalled();
    browser.unmount();
    vi.stubGlobal("isTauri", true);
    const native = render(element);
    expect(getTauriWindowMock().show).toHaveBeenCalledTimes(1);
    native.unmount();
  } finally {
    createRoot.mockRestore();
    vi.unstubAllGlobals();
    root.remove();
  }
});
