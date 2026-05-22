import { P5CanvasInstance, ReactP5Wrapper } from "react-p5-wrapper";
import {
  drawSettingsCircle,
  initGameCanvas,
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
      let ready = false;
      const live = () => settingsRef.current;

      const spawnCircle = () => {
        const r = live().radius;
        x = s.random(0, s.width);
        y = s.random(s.height * 0.45, s.height * 0.72);
        y = Math.max(r + 16, Math.min(y, s.height - r - 16));
      };

      const isCursorInsideCircle = () => {
        const d = s.dist(s.mouseX, s.mouseY, x, y);
        return d < live().radius;
      };

      setMessage("Click the circle down");

      s.setup = () => {
        initGameCanvas(s, () => {
          spawnCircle();
          ready = true;
        });
      };

      s.windowResized = () => {
        resizeGameCanvasToLayout(s);
        if (s.height > 0) spawnCircle();
      };

      s.draw = () => {
        if (!ready || s.height < 1) return;

        const { radius, jiggliness } = live();

        runMotionTrailFrame(s, () => {
          drawSettingsCircle(s, x, y, radius * 2, live());
          x = x + s.random(-jiggliness, jiggliness);
          y = y + s.random(-jiggliness, jiggliness);
          y = y - 0.25;
          if (x < 0) {
            x = s.width;
          }
        });

        if (y - radius < 0) {
          setGameResult("lost");
          setGameLive(false);
          setMessage("");
        } else if (y >= s.height) {
          setGameResult("won");
          setGameLive(false);
          setMessage("");
        }

        if (isCursorInsideCircle()) {
          s.cursor("pointer");
        } else {
          s.cursor("default");
        }
      };

      s.mousePressed = () => {
        if (!ready) return;
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
