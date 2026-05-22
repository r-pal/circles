import { useCallback, useRef } from "react";
import { P5CanvasInstance, ReactP5Wrapper } from "react-p5-wrapper";
import { getGameCanvasDimensions } from "../constants/canvas";
import { useLiveCallback } from "../hooks/useLiveCallback";
import { useLiveSettings } from "../hooks/useLiveSettings";
import {
  createGameCanvas,
  drawSettingsCircle,
  resizeGameCanvasToLayout,
  runMotionTrailFrame,
} from "../utils";
import { Settings } from "./CircleSettings";

export const DEFAULT_IDLE_CIRCLE_COUNT = 5;

type CircleState = { x: number; y: number };

type Level00Props = {
  settings: Settings;
  startGame: () => void;
  /** Circles on screen — break screen uses completed round count */
  circleCount?: number;
};

const Level00: React.FC<Level00Props> = ({
  settings,
  startGame,
  circleCount = DEFAULT_IDLE_CIRCLE_COUNT,
}) => {
  const settingsRef = useLiveSettings(settings);
  const startGameRef = useLiveCallback(startGame);
  const circleCountRef = useRef(circleCount);
  circleCountRef.current = circleCount;

  const sketch = useCallback(
    (s: P5CanvasInstance) => {
      const live = () => settingsRef.current;
      const targetCount = () => circleCountRef.current;
      let circles: CircleState[] = [];

      const initCircles = () => {
        const pad = live().radius;
        const n = Math.max(0, targetCount());
        circles = Array.from({ length: n }, () => ({
          x: s.random(pad, Math.max(pad + 1, s.width - pad)),
          y: s.random(pad, Math.max(pad + 1, s.height - pad)),
        }));
      };

      const advanceCircle = (c: CircleState) => {
        const { jiggliness } = live();
        c.x += s.random(-jiggliness, jiggliness);
        c.y += s.random(-jiggliness, jiggliness);
        if (c.x < 0) c.x = s.width;
        if (c.x > s.width) c.x = 0;
        if (c.y < 0) c.y = s.height;
        if (c.y > s.height) c.y = 0;
        c.x += s.random(0.5, 1.5);
      };

      const isOverAnyCircle = () => {
        const r = live().radius;
        return circles.some(
          (c) => s.dist(s.mouseX, s.mouseY, c.x, c.y) < r
        );
      };

      s.setup = () => {
        const { width, height } = getGameCanvasDimensions();
        createGameCanvas(s, width, height);
        initCircles();
      };

      s.windowResized = () => {
        resizeGameCanvasToLayout(s);
        initCircles();
      };

      s.draw = () => {
        if (circles.length !== targetCount()) {
          initCircles();
        }

        runMotionTrailFrame(s, () => {
          const current = live();
          const diameter = current.radius * 2;
          for (const c of circles) {
            drawSettingsCircle(s, c.x, c.y, diameter, current);
            advanceCircle(c);
          }
        });

        s.cursor(isOverAnyCircle() ? "pointer" : "default");
      };

      s.mousePressed = () => {
        if (isOverAnyCircle()) {
          startGameRef.current();
        }
      };
    },
    [settingsRef, startGameRef, circleCountRef]
  );

  return <ReactP5Wrapper sketch={sketch} />;
};

export default Level00;
