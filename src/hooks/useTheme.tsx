import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ThemeName = "standaard" | "ember";

type ThemeContextValue = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
};

const STORAGE_KEY = "slideshow.theme";
const DEFAULT_THEME: ThemeName = "standaard";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function isThemeName(value: string): value is ThemeName {
  return value === "standaard" || value === "ember";
}

function getInitialTheme(): ThemeName {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  const storedTheme = window.localStorage.getItem(STORAGE_KEY);
  if (storedTheme && isThemeName(storedTheme)) {
    return storedTheme;
  }

  return DEFAULT_THEME;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
