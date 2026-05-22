import { useCallback, useEffect } from "react";
import { useLiveSettings } from "../hooks/useLiveSettings";
import { P5CanvasInstance, ReactP5Wrapper } from "react-p5-wrapper";
import { getGameCanvasDimensions } from "../constants/canvas";
import {
  createGameCanvas,
  MOTION_TRAIL_STEPS,
  resizeGameCanvasToLayout,
  resolveCircleColors,
  runMotionTrailFrame,
} from "../utils";
import { Settings } from "./CircleSettings";

const MIN_DIAMETER = 10;
const GROW_PER_CLICK = 100;

type Level04Props = {
  settings: Settings;
  setGameResult: (value: "won" | "lost" | undefined) => void;
  setGameLive: (value: boolean) => void;
  setMessage: (value: string) => void;
};

const Level04: React.FC<Level04Props> = ({
  settings,
  setGameResult,
  setGameLive,
  setMessage,
}) => {
  const settingsRef = useLiveSettings(settings);

  useEffect(() => {
    setMessage("Left half grows — right half shrinks. Cover the whole screen.");
  }, [setMessage]);

  const sketch = useCallback(
    (s: P5CanvasInstance) => {
      const live = () => settingsRef.current;
      let x: number;
      let y: number;
      let angle = 0;
      let spiralRadius = 0;
      let diameter = live().radius * 2;

      const blockSize = 10;
      let visitedPixels: boolean[][] = [];

      const radius = () => diameter / 2;

      const initVisited = () => {
        const cols = Math.ceil(s.width / blockSize);
        const rows = Math.ceil(s.height / blockSize);
        visitedPixels = Array(cols)
          .fill(false)
          .map(() => Array(rows).fill(false));
      };

      const isOnCircle = () => {
        const r = radius();
        return s.dist(s.mouseX, s.mouseY, x, y) < r;
      };

      const drawSplitCircle = (cx: number, cy: number, d: number) => {
        const { fill, stroke } = resolveCircleColors(live());
        const r = d / 2;
        s.noStroke();
        s.fill(s.color(fill));
        s.arc(cx, cy, d, d, s.HALF_PI, 3 * s.HALF_PI);
        s.fill(s.color(stroke));
        s.arc(cx, cy, d, d, -s.HALF_PI, s.HALF_PI);
        s.stroke(s.color(stroke));
        s.strokeWeight(Math.max(2, d * 0.02));
        s.line(cx, cy - r, cx, cy + r);
      };

      const advanceSpiral = (fraction: number) => {
        angle += 0.1 * fraction;

        if (x <= 0 || x >= s.width || y <= 0 || y >= s.height) {
          spiralRadius -= 0.5 * fraction;
          if (spiralRadius <= 0) {
            spiralRadius = 0;
          }
        } else {
          spiralRadius += 0.5 * fraction;
        }

        x = s.width / 2 + spiralRadius * Math.cos(angle);
        y = s.height / 2 + spiralRadius * Math.sin(angle);
        x = Math.min(Math.max(x, 0), s.width - 1);
        y = Math.min(Math.max(y, 0), s.height - 1);
      };

      s.setup = () => {
        const { width, height } = getGameCanvasDimensions();
        createGameCanvas(s, width, height);
        initVisited();
        x = s.width / 2;
        y = s.height / 2;
      };

      s.windowResized = () => {
        resizeGameCanvasToLayout(s);
        initVisited();
      };

      s.mousePressed = () => {
        if (!isOnCircle()) return;

        if (s.mouseX < x) {
          diameter += GROW_PER_CLICK;
        } else {
          diameter = Math.max(MIN_DIAMETER, diameter - GROW_PER_CLICK);
        }
      };

      s.draw = () => {
        const r = radius();
        const stepFraction = 1 / MOTION_TRAIL_STEPS;

        runMotionTrailFrame(s, () => {
          drawSplitCircle(x, y, diameter);
          advanceSpiral(stepFraction);
        });

        const ri = Math.floor(r);
        for (let i = -ri; i <= ri; i++) {
          for (let j = -ri; j <= ri; j++) {
            const pixelX = Math.round(x) + i;
            const pixelY = Math.round(y) + j;

            if (
              i * i + j * j <= r * r &&
              pixelX >= 0 &&
              pixelX < s.width &&
              pixelY >= 0 &&
              pixelY < s.height
            ) {
              const col = Math.floor(pixelX / blockSize);
              const row = Math.floor(pixelY / blockSize);
              if (visitedPixels[col]?.[row] !== undefined) {
                visitedPixels[col][row] = true;
              }
            }
          }
        }

        if (isOnCircle()) {
          s.cursor("pointer");
        } else {
          s.cursor("default");
        }

        const allVisited = visitedPixels.every((row) => row.every(Boolean));

        if (allVisited) {
          setGameResult("won");
          setGameLive(false);
          setMessage("");
        }
      };
    },
    [settingsRef, setGameResult, setGameLive, setMessage]
  );

  return <ReactP5Wrapper sketch={sketch} />;
};

export default Level04;
