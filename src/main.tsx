import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { isTauri } from "@tauri-apps/api/core";

import { App } from "@/app/App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root was not found.");
}

async function showMainWindowWhenReady() {
  if (!isTauri()) {
    return;
  }

  await getCurrentWindow().show();
}

function RootApp() {
  useEffect(() => {
    void showMainWindowWhenReady().catch((error: unknown) => {
      console.error("Failed to show the Tauri main window.", error);
    });
  }, []);

  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

ReactDOM.createRoot(rootElement).render(<RootApp />);
