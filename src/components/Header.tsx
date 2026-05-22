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
    if (gameResult === "won") {
      return campaignComplete ? "New run" : `Level ${level}`;
    }
  };

  return (
    <div className="bg-surface flex justify-between items-center gap-2 px-2 select-none">
      <h1 className="text-foreground h-[35px] text-4xl xl:text-7xl xl:h-[66px] left-2 shrink-0">
        <a href="https://r-pal.github.io">CIRCLES</a>
      </h1>
      <div className="flex flex-1 items-center justify-end gap-2 md:gap-3 min-w-0 py-1">
        {!gameLive && <ThemeToggle />}
        {!gameLive && gameResult !== "lost" && text() && (
          <div onClick={() => startGame()} className="shrink-0">
            <Button form="settings" type="submit" text={text()} header />
          </div>
        )}
        {message ? (
          <p className="hidden md:block flex-1 min-w-0 max-w-xl xl:max-w-2xl text-foreground text-sm lg:text-base text-right leading-snug">
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default Header;
