import Button from "./Button";
import ThemeCycleBar from "./ThemeCycleBar";

type HeaderProps = {
  gameLive: boolean;
  gameResult: "won" | "lost" | undefined;
  level: number;
  message: string;
  startGame: () => void;
  campaignComplete?: boolean;
  suppressStartButton?: boolean;
};

const Header: React.FC<HeaderProps> = ({
  gameLive,
  gameResult,
  level,
  message,
  startGame,
  campaignComplete = false,
  suppressStartButton = false,
}) => {
  const startLabel = () => {
    if (!gameLive && gameResult === undefined) {
      return "Start";
    }
    if (gameResult === "won") {
      return campaignComplete ? "New run" : `Level ${level}`;
    }
    return null;
  };

  const label = startLabel();
  const showStartButton = Boolean(label) && !suppressStartButton;

  return (
    <header
      id="app-header"
      className="bg-surface flex items-center gap-2 px-2 py-1.5 select-none shrink-0"
    >
      <h1 className="text-foreground h-[35px] text-4xl xl:text-7xl xl:h-[66px] left-2 shrink-0">
        <a href="https://r-pal.github.io/circles">CIRCLES</a>
      </h1>
      <div className="flex flex-1 items-center justify-end gap-2 md:gap-3 min-w-0">
        {gameLive && message ? (
          <p className="hidden md:block flex-1 min-w-0 max-w-2xl xl:max-w-3xl text-foreground md:text-xl lg:text-2xl xl:text-3xl text-right leading-snug">
            {message}
          </p>
        ) : null}
        {showStartButton && (
          <div
            className="shrink-0"
            onClick={() => startGame()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                startGame();
              }
            }}
          >
            <Button type="button" text={label!} header />
          </div>
        )}
      </div>
      <ThemeCycleBar />
    </header>
  );
};

export default Header;
