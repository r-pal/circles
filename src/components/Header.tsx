import Button from "./Button";
import ThemeToggle from "./ThemeToggle";

type HeaderProps = {
  gameLive: boolean;
  gameResult: "won" | "lost" | undefined;
  level: number;
  message: string;
  startGame: () => void;
  campaignComplete?: boolean;
};

const Header: React.FC<HeaderProps> = ({
  gameLive,
  gameResult,
  level,
  message,
  startGame,
  campaignComplete = false,
}) => {
  const text = () => {
    if (!gameLive && gameResult === undefined) {
      return "Start";
    }
    if (gameResult === "lost") {
      return "Replay";
    }
    if (gameResult === "won") {
      return campaignComplete ? "New run" : `Level ${level}`;
    }
  };

  return (
    <div className="bg-surface flex justify-between items-center gap-2 px-2 select-none">
      <h1 className="text-foreground h-[35px] text-4xl xl:text-7xl xl:h-[66px] left-2 shrink-0">
        <a href="https://r-pal.github.io">CIRCLES</a>
      </h1>
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        {!gameLive && <ThemeToggle />}
        {!gameLive && (
          <div onClick={() => startGame()} className="shrink-0">
            <Button form="settings" type="submit" text={text()} header />
          </div>
        )}
        {message ? (
          <div className="hidden md:block text-foreground self-center text-sm md:text-base truncate max-w-xs">
            {message}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Header;
