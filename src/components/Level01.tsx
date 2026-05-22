import { P5CanvasInstance, ReactP5Wrapper } from "react-p5-wrapper";
import { getGameCanvasDimensions } from "../constants/canvas";
import {
  createGameCanvas,
  drawSettingsCircle,
  resizeGameCanvasToLayout,
  runMotionTrailFrame,
} from "../utils";
import { Settings } from "./CircleSettings";
import { useCallback } from "react";
import { useLiveSettings } from "../hooks/useLiveSettings";

type Level01Props = {
  settings: Settings;
  setGameResult: (value: "won" | "lost" | undefined) => void;
  setGameLive: (value: boolean) => void;
  setMessage: (value: string) => void;
};

const Level01: React.FC<Level01Props> = ({
  settings,
  setGameResult,
  setGameLive,
  setMessage,
}) => {
  const settingsRef = useLiveSettings(settings);

  const sketch = useCallback(
    (s: P5CanvasInstance) => {
      let x: number;
      let y: number;
      const live = () => settingsRef.current;
      const isCursorInsideCircle = () => {
        const d = s.dist(s.mouseX, s.mouseY, x, y);
        return d < live().radius;
      };
      setMessage("The circle wants clicks");
      s.setup = () => {
        const { width, height } = getGameCanvasDimensions();
        createGameCanvas(s, width, height);
        x = s.random(0, s.width);
        y = s.random(s.height / 3, s.height / 2);
      };

      s.windowResized = () => resizeGameCanvasToLayout(s);

      s.draw = () => {
        const { radius, jiggliness } = live();
        runMotionTrailFrame(s, () => {
          drawSettingsCircle(s, x, y, radius * 2, live());
          x = x + s.random(-jiggliness, jiggliness);
          y = y + s.random(-jiggliness, jiggliness);
          if (y < 0) {
            setGameResult("lost");
            setGameLive(false);
            setMessage("");
          }
          if (y >= s.height) {
            setGameResult("won");
            setGameLive(false);
            setMessage("");
          }
          if (x < 0) {
            x = s.width;
          }
          y = y - 0.25;
        });
        if (isCursorInsideCircle()) {
          s.cursor("pointer");
        } else {
          s.cursor("default");
        }
      };

      s.mousePressed = () => {
        if (isCursorInsideCircle()) {
          y = y + 300;
        }
      };
    },
    [settingsRef, setGameResult, setGameLive, setMessage]
  );

  return <ReactP5Wrapper sketch={sketch} />;
};

export default Level01;
