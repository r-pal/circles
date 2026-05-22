import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import ThemeShell from "../components/ThemeShell";
import {
  isThemeId,
  THEME_ORDER,
  Theme,
  ThemeId,
  themes,
} from "../constants/themes";

const STORAGE_KEY = "circles-theme";

type ThemeContextValue = {
  theme: Theme;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
  themeOrder: ThemeId[];
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeId, setThemeIdState] = useState<ThemeId>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored && isThemeId(stored) ? stored : "sea";
  });

  const theme = themes[themeId];

  const setThemeId = useCallback((id: ThemeId) => {
    setThemeIdState(id);
    localStorage.setItem(STORAGE_KEY, id);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      themeId,
      setThemeId,
      themeOrder: THEME_ORDER,
    }),
    [theme, themeId, setThemeId]
  );

  return (
    <ThemeContext.Provider value={value}>
      <ThemeShell theme={theme}>{children}</ThemeShell>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
};
