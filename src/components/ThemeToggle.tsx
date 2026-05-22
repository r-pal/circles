import clsx from "clsx";
import { useTheme } from "../context/ThemeContext";
import { themes, ThemeId } from "../constants/themes";

const ThemeToggle = () => {
  const { themeId, setThemeId, themeOrder } = useTheme();

  return (
    <div
      className="flex rounded-md overflow-hidden border border-foreground/25 shrink-0"
      role="group"
      aria-label="Colour theme"
    >
      {themeOrder.map((id: ThemeId) => (
        <button
          key={id}
          type="button"
          onClick={() => setThemeId(id)}
          className={clsx(
            "px-2 py-1 text-xs md:text-sm font-medium transition-colors",
            themeId === id
              ? "bg-foreground text-surface"
              : "bg-surface/40 text-foreground/80 hover:text-foreground"
          )}
          aria-pressed={themeId === id}
          title={themes[id].label}
        >
          {themes[id].label}
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;
