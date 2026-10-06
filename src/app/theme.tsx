import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { isTauri } from "@tauri-apps/api/core";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const themeStorageKey = "desktop-starter:theme";
const themeMediaQuery = "(prefers-color-scheme: dark)";
const themePreferences = ["light", "dark", "system"] as const;

type ThemeContextValue = {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isThemePreference(value: string | null): value is ThemePreference {
  return themePreferences.some((preference) => preference === value);
}

function readStoredThemePreference(): ThemePreference {
  if (typeof window === "undefined") {
    return "system";
  }

  const storedPreference = window.localStorage.getItem(themeStorageKey);
  return isThemePreference(storedPreference) ? storedPreference : "system";
}

function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference !== "system") {
    return preference;
  }

  return readSystemTheme();
}

function readSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.matchMedia(themeMediaQuery).matches ? "dark" : "light";
}

function applyTheme(preference: ThemePreference, resolvedTheme: ResolvedTheme) {
  document.documentElement.dataset.themePreference = preference;
  document.documentElement.dataset.theme = resolvedTheme;
}

async function readNativeSystemTheme(): Promise<ResolvedTheme> {
  const appWindow = getCurrentWindow();
  await appWindow.setTheme(null);

  return (await appWindow.theme()) ?? readSystemTheme();
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() =>
    readStoredThemePreference(),
  );
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(readStoredThemePreference()),
  );

  const setPreference = useCallback((nextPreference: ThemePreference) => {
    setPreferenceState(nextPreference);
    window.localStorage.setItem(themeStorageKey, nextPreference);
  }, []);

  useEffect(() => {
    let isCurrent = true;

    const applyResolvedTheme = (nextResolvedTheme: ResolvedTheme) => {
      if (!isCurrent) {
        return;
      }

      setResolvedTheme(nextResolvedTheme);
      applyTheme(preference, nextResolvedTheme);
    };

    if (preference !== "system") {
      applyResolvedTheme(preference);

      if (isTauri()) {
        void getCurrentWindow()
          .setTheme(preference)
          .catch((error: unknown) => {
            console.error("Failed to sync the native window theme.", error);
          });
      }

      return () => {
        isCurrent = false;
      };
    }

    const updateSystemTheme = () => {
      if (!isTauri()) {
        applyResolvedTheme(readSystemTheme());
        return;
      }

      void readNativeSystemTheme()
        .then(applyResolvedTheme)
        .catch((error: unknown) => {
          console.error("Failed to sync the system theme.", error);
        });
    };

    updateSystemTheme();

    const mediaQueryList = window.matchMedia(themeMediaQuery);
    mediaQueryList.addEventListener("change", updateSystemTheme);
    return () => {
      isCurrent = false;
      mediaQueryList.removeEventListener("change", updateSystemTheme);
    };
  }, [preference]);

  const value = useMemo(
    () => ({
      preference,
      resolvedTheme,
      setPreference,
    }),
    [preference, resolvedTheme, setPreference],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider.");
  }

  return context;
}

export const themeOptions: {
  label: string;
  value: ThemePreference;
}[] = [
  {
    label: "浅色",
    value: "light",
  },
  {
    label: "深色",
    value: "dark",
  },
  {
    label: "跟随系统",
    value: "system",
  },
];

export { themeStorageKey };
