import { useEffect, type ReactNode } from "react";
import type { Theme } from "../constants/themes";
import { getThemeCssProperties } from "../theme/getThemeCssProperties";
import { setMotionTrailCanvasBg } from "../utils/p5MotionTrail";

type ThemeShellProps = {
  theme: Theme;
  children: ReactNode;
};

/** Top-level wrapper: all UI colours inherit from these CSS variables */
const ThemeShell = ({ theme, children }: ThemeShellProps) => {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme.id);
    setMotionTrailCanvasBg(theme.canvasRgb);
  }, [theme]);

  return (
    <div
      id="theme-root"
      data-theme={theme.id}
      className="h-screen max-h-screen overflow-hidden flex flex-col bg-canvas text-foreground"
      style={getThemeCssProperties(theme)}
    >
      {children}
    </div>
  );
};

export default ThemeShell;
