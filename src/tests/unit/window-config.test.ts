import tauriConfig from "../../../src-tauri/tauri.conf.json";

type TauriWindowConfig = {
  hiddenTitle?: boolean;
  titleBarStyle?: string;
  title?: string;
};

describe("Tauri main window config", () => {
  it("uses the native macOS titlebar instead of an overlay titlebar", () => {
    const config = tauriConfig as { app: { windows: TauriWindowConfig[] } };
    const mainWindow = config.app.windows.find(
      (windowConfig) => windowConfig.title === "Desktop Starter",
    );

    expect(mainWindow).toBeDefined();
    expect(mainWindow).not.toHaveProperty("hiddenTitle");
    expect(mainWindow).not.toHaveProperty("titleBarStyle");
  });
});
