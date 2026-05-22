import { useMemo } from "react";
import { useTheme } from "../context/ThemeContext";
import { themes, THEME_ORDER, THEME_CYCLE_MS } from "../constants/themes";

const WHEEL_SIZE = 60;
const RADIUS = WHEEL_SIZE / 2;

export const THEME_WHEEL_BLOCK_HEIGHT = RADIUS;

const semicircleClip = (w: number, h: number) =>
  `path('M 0 0 L ${w} 0 A ${w / 2} ${h} 0 0 1 0 ${h} Z')`;

const ThemeCycleBar = () => {
  const { themeId, cycleRotationDeg, cyclePaused, toggleCyclePaused } =
    useTheme();

  const wheelGradient = useMemo(() => {
    const stops = THEME_ORDER.map((id, i) => {
      const t = themes[id];
      const start = (i / THEME_ORDER.length) * 100;
      const end = ((i + 1) / THEME_ORDER.length) * 100;
      return `${t.canvas} ${start}% ${end}%`;
    }).join(", ");
    return `conic-gradient(from -90deg, ${stops})`;
  }, []);

  return (
    <div
      className="relative shrink-0 overflow-hidden"
      style={{
        width: WHEEL_SIZE,
        height: THEME_WHEEL_BLOCK_HEIGHT,
        minWidth: WHEEL_SIZE,
        maxWidth: WHEEL_SIZE,
      }}
      role="group"
      aria-label={
        cyclePaused
          ? `Theme wheel paused on ${themes[themeId].label}. Click to resume.`
          : `Theme wheel cycling, ${Math.round(THEME_CYCLE_MS / 1000)} seconds per colour. Click to pause.`
      }
    >
      <button
        type="button"
        onClick={toggleCyclePaused}
        className="absolute left-0 top-0 overflow-hidden border-0 p-0 bg-transparent cursor-pointer"
        style={{
          width: WHEEL_SIZE,
          height: RADIUS,
          clipPath: semicircleClip(WHEEL_SIZE, RADIUS),
        }}
        aria-pressed={cyclePaused}
        title={
          cyclePaused
            ? `${themes[themeId].label} — paused. Click to resume.`
            : `${themes[themeId].label} — click to pause`
        }
      >
        <div
          className="absolute rounded-full will-change-transform"
          style={{
            width: WHEEL_SIZE,
            height: WHEEL_SIZE,
            left: 0,
            top: -RADIUS,
            background: wheelGradient,
            transform: `rotate(${cycleRotationDeg}deg)`,
            transformOrigin: "center center",
          }}
          aria-hidden
        />
      </button>
    </div>
  );
};

export default ThemeCycleBar;
