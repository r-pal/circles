import { useCallback, useEffect } from "react";
import { P5CanvasInstance, ReactP5Wrapper } from "react-p5-wrapper";
import { getGameCanvasDimensions } from "../constants/canvas";
import { useLiveSettings } from "../hooks/useLiveSettings";
import {
  createGameCanvas,
  drawSettingsCircle,
  isPointerOverCircle,
  MOTION_TRAIL_STEPS,
  resizeGameCanvasToLayout,
  runMotionTrailFrame,
} from "../utils";
import { Settings } from "./CircleSettings";

const LAPS_TO_WIN = 3;
const ORBIT_RADIUS_RATIO = 0.32;
const MIN_ANGULAR_SPEED = 0.004;
const STALL_MS = 3500;
const CLICK_BOOST = 0.028;
const ANGULAR_DRAG = 0.998;

type Level05Props = {
  settings: Settings;
  setGameResult: (value: "won" | "lost" | undefined) => void;
  setGameLive: (value: boolean) => void;
  setMessage: (value: string) => void;
};

const Level05: React.FC<Level05Props> = ({
  settings,
  setGameResult,
  setGameLive,
  setMessage,
}) => {
  const settingsRef = useLiveSettings(settings);

  useEffect(() => {
    setMessage("Click the circle to speed it up — complete 3 laps");
  }, [setMessage]);

  const sketch = useCallback(
    (s: P5CanvasInstance) => {
      const live = () => settingsRef.current;
      let theta = 0;
      let angularSpeed = 0.03;
      let distanceTravelled = 0;
      let stallSince = 0;
      let cx = 0;
      let cy = 0;
      let orbitR = 0;

      const position = () => ({
        x: cx + orbitR * Math.cos(theta),
        y: cy + orbitR * Math.sin(theta),
      });

      const initOrbit = () => {
        cx = s.width / 2;
        cy = s.height / 2;
        orbitR = Math.min(s.width, s.height) * ORBIT_RADIUS_RATIO;
        theta = s.random(0, s.TWO_PI);
      };

      const endGame = (result: "won" | "lost") => {
        setGameResult(result);
        setGameLive(false);
        setMessage("");
        s.noLoop();
      };

      s.setup = () => {
        const { width, height } = getGameCanvasDimensions();
        createGameCanvas(s, width, height);
        initOrbit();
      };

      s.windowResized = () => {
        resizeGameCanvasToLayout(s);
        initOrbit();
      };

      s.mousePressed = () => {
        const { x, y } = position();
        const r = live().radius;
        if (isPointerOverCircle(s, x, y, r)) {
          angularSpeed += CLICK_BOOST;
        }
      };

      s.draw = () => {
        const now = s.millis();
        const { radius } = live();
        const stepAngle = angularSpeed / MOTION_TRAIL_STEPS;

        runMotionTrailFrame(s, () => {
          theta += stepAngle;
          distanceTravelled += Math.abs(stepAngle);
          const { x, y } = position();
          drawSettingsCircle(s, x, y, radius * 2, live());
        });

        angularSpeed *= ANGULAR_DRAG;

        if (Math.abs(angularSpeed) < MIN_ANGULAR_SPEED) {
          if (stallSince === 0) stallSince = now;
          if (now - stallSince >= STALL_MS) {
            endGame("lost");
            return;
          }
        } else {
          stallSince = 0;
        }

        const { x, y } = position();
        s.cursor(isPointerOverCircle(s, x, y, radius) ? "pointer" : "default");

        if (distanceTravelled >= s.TWO_PI * LAPS_TO_WIN) {
          endGame("won");
        }
      };
    },
    [settingsRef, setGameResult, setGameLive, setMessage]
  );

  return <ReactP5Wrapper sketch={sketch} />;
};

export default Level05;
