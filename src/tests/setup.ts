import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

const tauriWindowMock = vi.hoisted(() => ({
  setTheme: vi.fn<(theme?: "light" | "dark" | null) => Promise<void>>(() =>
    Promise.resolve(undefined),
  ),
  show: vi.fn<() => Promise<void>>(() => Promise.resolve(undefined)),
  theme: vi.fn<() => Promise<"light" | "dark" | null>>(() =>
    Promise.resolve("dark"),
  ),
}));

vi.mock("@tauri-apps/api/window", () => ({
  getCurrentWindow: () => tauriWindowMock,
}));

export function getTauriWindowMock() {
  return tauriWindowMock;
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string): MediaQueryList => ({
    matches: true,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

class TestResizeObserver implements ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  value: TestResizeObserver,
});

Object.defineProperty(globalThis, "ResizeObserver", {
  writable: true,
  value: TestResizeObserver,
});
