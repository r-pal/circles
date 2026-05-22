export type ThemeId = "sea" | "tangerine" | "coral";

export type Theme = {
  id: ThemeId;
  label: string;
  canvas: string;
  canvasRgb: [number, number, number];
  surface: string;
  foreground: string;
  accent: string;
  selection: string;
  buttonBg: string;
  buttonText: string;
  /** Text readable on the game canvas (may differ from header foreground) */
  onCanvas: string;
  defaultCircle: { colour1: string; colour2: string };
};

export const themes: Record<ThemeId, Theme> = {
  sea: {
    id: "sea",
    label: "Sea",
    canvas: "#315964",
    canvasRgb: [50, 89, 100],
    surface: "#3A3042",
    foreground: "#EDFFD9",
    accent: "#FF784F",
    selection: "#FF784F",
    buttonBg: "#EDFFD9",
    buttonText: "#3A3042",
    onCanvas: "#EDFFD9",
    defaultCircle: { colour1: "#3A3042", colour2: "#EDFFD9" },
  },
  tangerine: {
    id: "tangerine",
    label: "Tangerine",
    canvas: "#3A3042",
    canvasRgb: [58, 48, 66],
    surface: "#DB9D47",
    foreground: "#3A3042",
    accent: "#FF784F",
    selection: "#EDFFD9",
    buttonBg: "#3A3042",
    buttonText: "#EDFFD9",
    onCanvas: "#EDFFD9",
    defaultCircle: { colour1: "#DB9D47", colour2: "#3A3042" },
  },
  coral: {
    id: "coral",
    label: "Coral",
    canvas: "#DB9D47",
    canvasRgb: [219, 157, 71],
    surface: "#FF784F",
    foreground: "#3A3042",
    accent: "#DB9D47",
    selection: "#DB9D47",
    buttonBg: "#3A3042",
    buttonText: "#EDFFD9",
    onCanvas: "#3A3042",
    defaultCircle: { colour1: "#FF784F", colour2: "#EDFFD9" },
  },
};

export const THEME_ORDER: ThemeId[] = ["sea", "tangerine", "coral"];

export const isThemeId = (value: string): value is ThemeId =>
  value in themes;

/** Random theme; pass the previous level's theme to avoid repeats */
export const pickRandomThemeId = (exclude?: ThemeId): ThemeId => {
  const pool = exclude
    ? THEME_ORDER.filter((id) => id !== exclude)
    : THEME_ORDER;
  return pool[Math.floor(Math.random() * pool.length)];
};
