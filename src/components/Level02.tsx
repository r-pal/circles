import { useCallback, useEffect } from "react";
import { useLiveSettings } from "../hooks/useLiveSettings";
import { P5CanvasInstance, ReactP5Wrapper } from "react-p5-wrapper";
import { getGameCanvasDimensions } from "../constants/canvas";
import {
  createGameCanvas,
  drawSettingsCircle,
  resizeGameCanvasToLayout,
  runMotionTrailFrame,
} from "../utils";
import { Settings } from "./CircleSettings";

const GROWTH_PER_STEP = 0.05;
const MOVE_LERP = 0.1;

type Level02Props = {
  settings: Settings;
  setGameResult: (value: "won" | "lost" | undefined) => void;
  setGameLive: (value: boolean) => void;
  setMessage: (value: string) => void;
};

const Level02: React.FC<Level02Props> = ({
  settings,
  setGameResult,
  setGameLive,
  setMessage,
}) => {
  const settingsRef = useLiveSettings(settings);

  useEffect(() => {
    setMessage("The circle wants clicks");
  }, [setMessage]);

  const sketch = useCallback(
    (s: P5CanvasInstance) => {
      let x: number;
      let y: number;
      let diameter = settingsRef.current.radius * 2;
      const live = () => settingsRef.current;

      const randomY = () => s.random(s.height / 3, s.height / 2);

      const isCursorInsideCircle = () =>
        s.dist(s.mouseX, s.mouseY, x, y) < diameter / 2;

      s.setup = () => {
        const { width, height } = getGameCanvasDimensions();
        createGameCanvas(s, width, height);
        x = s.random(0, s.width);
        y = randomY();
      };

      s.windowResized = () => resizeGameCanvasToLayout(s);

      s.draw = () => {
        runMotionTrailFrame(s, () => {
          const destX = s.random(0, s.width);
          const destY = randomY();
          x += (destX - x) * MOVE_LERP;
          y += (destY - y) * MOVE_LERP;
          drawSettingsCircle(s, x, y, diameter, live());

          if (x < 0) x = s.width;
          if (y < 0) y = s.height;

          diameter += GROWTH_PER_STEP;
        });

        if (diameter > s.height) {
          setGameResult("lost");
          setGameLive(false);
          setMessage("");
          s.noLoop();
          return;
        }
        if (diameter < 25) {
          setGameResult("won");
          setGameLive(false);
          setMessage("");
          s.noLoop();
          return;
        }

        s.cursor(isCursorInsideCircle() ? "pointer" : "default");
      };

      s.mousePressed = () => {
        if (isCursorInsideCircle()) {
          diameter -= 75;
        }
      };
    },
    [settingsRef, setGameResult, setGameLive, setMessage]
  );

  return <ReactP5Wrapper sketch={sketch} />;
};

export default Level02;
