import type { CSSProperties } from "react";
import type { Theme } from "../constants/themes";

/** Single source of theme CSS variables — applied on ThemeShell */
export const getThemeCssProperties = (theme: Theme): CSSProperties =>
  ({
    "--theme-canvas": theme.canvas,
    "--theme-surface": theme.surface,
    "--theme-foreground": theme.foreground,
    "--theme-accent": theme.accent,
    "--theme-selection": theme.selection,
    "--theme-button-bg": theme.buttonBg,
    "--theme-button-text": theme.buttonText,
    "--theme-on-canvas": theme.onCanvas,
  }) as CSSProperties;
