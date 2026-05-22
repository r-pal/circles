import { THEME_ORDER, ThemeId } from "../constants/themes";

const SECTOR = 360 / THEME_ORDER.length;

/** Where the nyanza pointer meets the wheel: top of semicircle (12 o'clock) */
const READ_ANGLE = 270;

/** Which theme sits under the pointer for a given wheel rotation (degrees, clockwise) */
export const themeIdFromRotation = (rotationDeg: number): ThemeId => {
  const local =
    (((READ_ANGLE - rotationDeg) % 360) + 360) % 360;
  const index =
    Math.floor(((local + 90) % 360) / SECTOR) % THEME_ORDER.length;
  return THEME_ORDER[index];
};

/** Progress 0–1 within the current sector (for optional UI) */
export const segmentProgressFromRotation = (rotationDeg: number): number => {
  const local =
    (((READ_ANGLE - rotationDeg) % 360) + 360) % 360;
  const shifted = (local + 90) % 360;
  return (shifted % SECTOR) / SECTOR;
};

/** Rotation so sector `index` is active under the pointer */
export const rotationForThemeIndex = (index: number) => index * SECTOR;
