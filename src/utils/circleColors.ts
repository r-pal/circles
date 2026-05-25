import type { Settings } from "../components/CircleSettings";
import type { Theme } from "../constants/themes";

const DEFAULT_FILL = "#3A3042";
const DEFAULT_STROKE = "#EDFFD9";

let drawTheme: Theme | null = null;

/** Keep in sync with the active UI theme (called from ThemeShell) */
export const setCircleDrawTheme = (theme: Theme) => {
  drawTheme = theme;
  colorCacheKey = "";
};

/** Parse #RRGGBB without RegExp — safe when values are not plain strings */
const parseSettingsHex = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.length !== 7 || trimmed.charAt(0) !== "#") return null;
  for (let i = 1; i < 7; i++) {
    const code = trimmed.charCodeAt(i);
    const isDigit = code >= 48 && code <= 57;
    const isUpper = code >= 65 && code <= 70;
    const isLower = code >= 97 && code <= 102;
    if (!isDigit && !isUpper && !isLower) return null;
  }
  return trimmed;
};

/** RGB 0–255 for p5 — pass numbers directly, never s.color(hex) */
export const hexToRgb = (hex: unknown): [number, number, number] => {
  const parsed = parseSettingsHex(hex) ?? DEFAULT_FILL;
  const n = parseInt(parsed.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

let colorCacheKey = "";
let colorCache = { fill: DEFAULT_FILL, stroke: DEFAULT_STROKE };

/** Fill + stroke for p5 circles */
export const resolveCircleColors = (
  settings: Pick<Settings, "colour1" | "colour2">
): { fill: string; stroke: string } => {
  const colour1 = settings.colour1;
  const colour2 = settings.colour2;
  const key = `${drawTheme?.id ?? ""}|${typeof colour1 === "string" ? colour1 : ""}|${typeof colour2 === "string" ? colour2 : ""}`;
  if (key === colorCacheKey) {
    return { fill: colorCache.fill, stroke: colorCache.stroke };
  }

  const theme = drawTheme;

  const fill =
    parseSettingsHex(colour1) ??
    parseSettingsHex(theme?.defaultCircle.colour1) ??
    DEFAULT_FILL;

  const strokeCandidates = [
    colour2,
    theme?.defaultCircle.colour2,
    theme?.onCanvas,
    theme?.defaultCircle.colour1,
    colour1,
    DEFAULT_STROKE,
  ];

  let stroke = DEFAULT_STROKE;
  for (const candidate of strokeCandidates) {
    const hex = parseSettingsHex(candidate);
    if (!hex) continue;
    if (theme?.canvas && hex.toLowerCase() === theme.canvas.toLowerCase()) {
      continue;
    }
    stroke = hex;
    break;
  }

  colorCacheKey = key;
  colorCache = { fill, stroke };
  return colorCache;
};
