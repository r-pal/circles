import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  THEME_CYCLE_MS,
} from "../constants/themes";
import {
  rotationForThemeIndex,
  segmentProgressFromRotation,
  themeIdFromRotation,
} from "../theme/wheelTheme";

const STORAGE_KEY = "circles-theme";

const FULL_CYCLE_MS = THEME_CYCLE_MS * THEME_ORDER.length;
const DEG_PER_MS = 360 / FULL_CYCLE_MS;

type ThemeContextValue = {
  theme: Theme;
  themeId: ThemeId;
  setThemeId: (id: ThemeId, options?: { preserveWheel?: boolean }) => void;
  themeOrder: ThemeId[];
  segmentProgress: number;
  cycleRotationDeg: number;
  cyclePaused: boolean;
  toggleCyclePaused: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const initialId: ThemeId = (() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored && isThemeId(stored) ? stored : "sea";
  })();

  const initialIndex = THEME_ORDER.indexOf(initialId);
  const cycleStartRef = useRef(
    performance.now() - initialIndex * THEME_CYCLE_MS
  );
  const totalPausedMsRef = useRef(0);
  const pauseStartedRef = useRef<number | null>(null);
  /** Game/level theme pick: keep colours until the wheel reaches that sector */
  const manualThemeRef = useRef<ThemeId | null>(null);
  const [themeId, setThemeIdState] = useState<ThemeId>(initialId);
  const [segmentProgress, setSegmentProgress] = useState(0);
  const [cycleRotationDeg, setCycleRotationDeg] = useState(
    initialIndex * (360 / THEME_ORDER.length)
  );
  const [cyclePaused, setCyclePaused] = useState(false);

  const theme = themes[themeId];

  const elapsedMs = useCallback((now: number) => {
    const pausedMs =
      totalPausedMsRef.current +
      (pauseStartedRef.current !== null ? now - pauseStartedRef.current : 0);
    return now - cycleStartRef.current - pausedMs;
  }, []);

  const syncFromClock = useCallback(
    (now: number) => {
      const elapsed = elapsedMs(now);
      const rotation = (((elapsed * DEG_PER_MS) % 360) + 360) % 360;
      const wheelId = themeIdFromRotation(rotation);
      const progress = segmentProgressFromRotation(rotation);
      let id = wheelId;
      const manual = manualThemeRef.current;
      if (manual !== null) {
        if (wheelId === manual) {
          manualThemeRef.current = null;
        } else {
          id = manual;
        }
      }

      setCycleRotationDeg(rotation);
      setThemeIdState(id);
      setSegmentProgress(progress);
    },
    [elapsedMs]
  );

  const toggleCyclePaused = useCallback(() => {
    const now = performance.now();
    if (pauseStartedRef.current !== null) {
      totalPausedMsRef.current += now - pauseStartedRef.current;
      pauseStartedRef.current = null;
      setCyclePaused(false);
      syncFromClock(now);
    } else {
      pauseStartedRef.current = now;
      setCyclePaused(true);
    }
  }, [syncFromClock]);

  useEffect(() => {
    let frame = 0;
    const animate = (now: number) => {
      if (pauseStartedRef.current === null) {
        syncFromClock(now);
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [syncFromClock]);

  const setThemeId = useCallback(
    (id: ThemeId, options?: { preserveWheel?: boolean }) => {
      localStorage.setItem(STORAGE_KEY, id);

      if (options?.preserveWheel) {
        manualThemeRef.current = id;
        setThemeIdState(id);
        return;
      }

      manualThemeRef.current = null;
      const index = THEME_ORDER.indexOf(id);
      const now = performance.now();
      cycleStartRef.current = now - index * THEME_CYCLE_MS;
      totalPausedMsRef.current = 0;
      if (pauseStartedRef.current !== null) {
        pauseStartedRef.current = now;
      }
      const rotation = rotationForThemeIndex(index);
      setCycleRotationDeg(rotation);
      setThemeIdState(id);
      setSegmentProgress(0);
    },
    []
  );

  const value = useMemo(
    () => ({
      theme,
      themeId,
      setThemeId,
      themeOrder: THEME_ORDER,
      segmentProgress,
      cycleRotationDeg,
      cyclePaused,
      toggleCyclePaused,
    }),
    [
      theme,
      themeId,
      setThemeId,
      segmentProgress,
      cycleRotationDeg,
      cyclePaused,
      toggleCyclePaused,
    ]
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
