import { useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import CircleSettings, { Settings } from "./CircleSettings";
import Game from "./Game";
import Header from "./Header";
import LevelAdviceFooter from "./LevelAdviceFooter";
import Button from "./Button";
import Level00, { DEFAULT_IDLE_CIRCLE_COUNT } from "./Level00";
import { useTheme } from "../context/ThemeContext";
import {
  MD_BREAKPOINT,
  resetP5LayoutResizeCache,
  scheduleP5LayoutResize,
} from "../constants/canvas";
import { formatRunTime, RUN_TIMER_TICK_MS, totalRunTicks } from "../utils";

const MAX_LEVEL = 5;

const App: React.FC = () => {
  const { theme, themeId } = useTheme();
  const [gameResult, setGameResult] = useState<"won" | "lost" | undefined>(
    undefined
  );
  const [gameLive, setGameLive] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    radius: 60,
    colour1: theme.defaultCircle.colour1,
    colour2: theme.defaultCircle.colour2 || theme.defaultCircle.colour1,
    jiggliness: 3,
  });
  const [level, setLevel] = useState(1);
  const [message, setMessage] = useState("");
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [levelSplits, setLevelSplits] = useState<number[]>([]);

  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      colour1: theme.defaultCircle.colour1,
      colour2: theme.defaultCircle.colour2 || theme.defaultCircle.colour1,
    }));
  }, [themeId, theme.defaultCircle.colour1, theme.defaultCircle.colour2]);

  const resetRun = () => {
    setTimeElapsed(0);
    setLevelSplits([]);
  };

  const startGame = useCallback(() => {
    if (gameLive) return;

    const wasLost = gameResult === "lost";
    const campaignComplete =
      gameResult === "won" &&
      level >= MAX_LEVEL &&
      levelSplits.length >= MAX_LEVEL;
    const freshStart =
      gameResult === undefined && level === 1 && levelSplits.length === 0;

    setGameResult(undefined);

    if (wasLost || campaignComplete) {
      setLevel(1);
      resetRun();
    } else if (freshStart) {
      resetRun();
    }

    setGameLive(true);
  }, [gameLive, gameResult, level, levelSplits.length]);

  useEffect(() => {
    if (gameResult !== "won") return;

    setLevelSplits((prev) => {
      const priorTotal = totalRunTicks(prev);
      return [...prev, timeElapsed - priorTotal];
    });
    setLevel((l) => (l < MAX_LEVEL ? l + 1 : l));
  }, [gameResult, timeElapsed]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (gameLive) {
      interval = setInterval(
        () => setTimeElapsed((prev) => prev + 1),
        RUN_TIMER_TICK_MS
      );
    }
    return () => clearInterval(interval);
  }, [gameLive]);

  const runTotal = totalRunTicks(levelSplits);
  const lastSplit = levelSplits[levelSplits.length - 1];
  const campaignComplete =
    gameResult === "won" && levelSplits.length >= MAX_LEVEL;
  const showSplits = campaignComplete && levelSplits.length > 0;

  const showLevelAdvice = gameLive && message.length > 0;
  const [isMobileViewport, setIsMobileViewport] = useState(
    () =>
      typeof window !== "undefined" && window.innerWidth < MD_BREAKPOINT
  );
  const idleCircleCount =
    gameResult === "won" ? levelSplits.length : DEFAULT_IDLE_CIRCLE_COUNT;

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MD_BREAKPOINT - 1}px)`);
    const sync = () => setIsMobileViewport(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    resetP5LayoutResizeCache();
    scheduleP5LayoutResize();
  }, [showLevelAdvice, isMobileViewport]);

  useEffect(() => {
    const targets = ["game-stage", "app-header", "level-advice-footer"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) return;

    const observer = new ResizeObserver(scheduleP5LayoutResize);
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [showLevelAdvice]);

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      <Header
        gameLive={gameLive}
        gameResult={gameResult}
        level={level}
        message={message}
        startGame={startGame}
        campaignComplete={campaignComplete}
      />
      <div
        id="game-stage"
        className="bg-canvas relative flex-1 min-h-0 overflow-hidden"
      >
        <div className="sr-only">
          <CircleSettings setSettings={setSettings} />
        </div>
        <div>
          {gameLive ? (
            <>
              <Game
                settings={settings}
                setGameResult={setGameResult}
                setGameLive={setGameLive}
                level={level}
                setMessage={setMessage}
              />
              <div
                className={clsx(
                  "absolute left-4 md:left-10 z-50 pointer-events-none select-none -translate-y-1/2",
                  showLevelAdvice ? "bottom-20 md:bottom-10" : "bottom-10"
                )}
              >
                <p className="text-on-canvas text-5xl md:text-7xl leading-none">
                  {formatRunTime(timeElapsed)}
                </p>
                <p className="text-on-canvas/80 text-xl md:text-2xl mt-1">
                  Level {level}
                </p>
              </div>
            </>
          ) : (
            <>
              <Level00
                settings={settings}
                startGame={startGame}
                circleCount={idleCircleCount}
              />
              <div className="absolute top-1/2 inset-0 flex flex-col items-center justify-center z-50 pointer-events-none select-none text-center px-4">
                {gameResult === "won" && (
                  <>
                    <h1 className="text-on-canvas text-7xl md:text-9xl">
                      WINNER
                    </h1>
                    {lastSplit !== undefined && (
                      <p className="text-on-canvas text-2xl md:text-4xl mt-4">
                        Level {levelSplits.length}: {formatRunTime(lastSplit)}
                      </p>
                    )}
                    <p className="text-on-canvas text-3xl md:text-5xl mt-2">
                      Total: {formatRunTime(runTotal || timeElapsed)}
                    </p>
                    {showSplits && (
                      <ul className="text-on-canvas/90 text-lg md:text-2xl mt-6 space-y-1">
                        {levelSplits.map((split, i) => (
                          <li key={i}>
                            Level {i + 1}: {formatRunTime(split)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
                {gameResult === "lost" && (
                  <>
                    <div
                      className="pointer-events-auto cursor-pointer"
                      onClick={startGame}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          startGame();
                        }
                      }}
                    >
                      <Button type="button" text="TRY AGAIN" header />
                    </div>
                    <p className="text-on-canvas text-2xl md:text-4xl mt-6">
                      Time: {formatRunTime(timeElapsed)}
                    </p>
                    {levelSplits.length > 0 && (
                      <p className="text-on-canvas/80 text-lg md:text-xl mt-2">
                        Best total so far: {formatRunTime(runTotal)}
                      </p>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <LevelAdviceFooter message={message} visible={showLevelAdvice} />
    </div>
  );
};

export default App;
