import type { Settings } from "../components/CircleSettings";
import type { Theme } from "../constants/themes";

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;

let drawTheme: Theme | null = null;

/** Keep in sync with the active UI theme (called from ThemeShell) */
export const setCircleDrawTheme = (theme: Theme) => {
  drawTheme = theme;
};

const validHex = (value: string | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed && HEX_COLOR.test(trimmed) ? trimmed : null;
};

/** Fill + stroke for p5 circles; theme wins over empty/invalid settings */
export const resolveCircleColors = (
  settings: Pick<Settings, "colour1" | "colour2">
): { fill: string; stroke: string } => {
  const theme = drawTheme;

  const fill =
    validHex(settings.colour1) ??
    validHex(theme?.defaultCircle.colour1) ??
    "#3A3042";

  const strokeCandidates = [
    settings.colour2,
    theme?.defaultCircle.colour2,
    theme?.onCanvas,
    theme?.defaultCircle.colour1,
    settings.colour1,
    "#EDFFD9",
  ];

  let stroke = "#EDFFD9";
  for (const candidate of strokeCandidates) {
    const hex = validHex(candidate);
    if (!hex) continue;
    if (theme?.canvas && hex.toLowerCase() === theme.canvas.toLowerCase()) {
      continue;
    }
    stroke = hex;
    break;
  }

  return { fill, stroke };
};
