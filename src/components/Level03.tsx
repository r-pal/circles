import { useCallback, useEffect } from "react";
import { useLiveSettings } from "../hooks/useLiveSettings";
import { P5CanvasInstance, ReactP5Wrapper } from "react-p5-wrapper";
import {
  getGameCanvasDimensions,
  getViewportTier,
  LEVEL03_MOVEMENT_SPEED,
} from "../constants/canvas";
import {
  createGameCanvas,
  drawSettingsCircle,
  growScaleOnCircleClick,
  isPointerOverCircle,
  MOTION_TRAIL_STEPS,
  resizeGameCanvasToLayout,
  runMotionTrailFrame,
  TRAIL_FADE_ALPHA_LONG,
} from "../utils";
import { Settings } from "./CircleSettings";

const BLOCK_SIZE = 10;
const BASE_DECAY_MS = 6000;
const WIN_COVERAGE = 0.9;
const WIN_HOLD_MS = 3000;
const GAME_TIME_MS = 90000;
const REFERENCE_SCREEN_MIN = 720;
const MAX_DIAMETER_WIDTH_FRACTION = 0.5;
const NEVER_PAINTED = -1;

type Level03Props = {
  settings: Settings;
  setGameResult: (value: "won" | "lost" | undefined) => void;
  setGameLive: (value: boolean) => void;
  setMessage: (value: string) => void;
};

const Level03: React.FC<Level03Props> = ({
  settings,
  setGameResult,
  setGameLive,
  setMessage,
}) => {
  const settingsRef = useLiveSettings(settings);

  useEffect(() => {
    setMessage("Click the circle to grow — hold to herd. Keep 90% painted.");
  }, [setMessage]);

  const sketch = useCallback(
    (s: P5CanvasInstance) => {
      const live = () => settingsRef.current;
      let x = 0;
      let y = 0;
      let blockPaintTime: number[][] = [];
      let cols = 0;
      let rows = 0;
      let aboveThresholdSince = 0;
      let gameStartMs = 0;
      let gameEnded = false;
      let sizeScale = 1;

      const initGrid = () => {
        cols = Math.ceil(s.width / BLOCK_SIZE);
        rows = Math.ceil(s.height / BLOCK_SIZE);
        blockPaintTime = Array(cols)
          .fill(NEVER_PAINTED)
          .map(() => Array(rows).fill(NEVER_PAINTED));
      };

      const screenScale = () =>
        Math.max(1, Math.min(s.width, s.height) / REFERENCE_SCREEN_MIN);

      const movementSpeedMultiplier = () =>
        LEVEL03_MOVEMENT_SPEED[getViewportTier(s.width)];

      const decayMs = () => BASE_DECAY_MS * screenScale();

      const isBlockPainted = (paintTime: number, now: number) =>
        paintTime >= 0 && now - paintTime < decayMs();

      const baseRadius = () => live().radius * screenScale();

      /** Max scale so circle diameter reaches 50% of canvas width */
      const maxSizeScale = () => {
        const base = baseRadius();
        if (base <= 0 || s.width <= 0) return 1;
        const maxRadius = (s.width * MAX_DIAMETER_WIDTH_FRACTION) / 2;
        return Math.max(1, maxRadius / base);
      };

      const paintBlocks = (cx: number, cy: number, radius: number, now: number) => {
        const px = Math.round(cx);
        const py = Math.round(cy);
        const r = Math.floor(radius);

        for (let i = -r; i <= r; i++) {
          for (let k = -r; k <= r; k++) {
            if (i * i + k * k > radius * radius) continue;

            const pixelX = px + i;
            const pixelY = py + k;
            if (
              pixelX < 0 ||
              pixelX >= s.width ||
              pixelY < 0 ||
              pixelY >= s.height
            ) {
              continue;
            }

            const col = Math.floor(pixelX / BLOCK_SIZE);
            const row = Math.floor(pixelY / BLOCK_SIZE);
            if (col < cols && row < rows) {
              blockPaintTime[col][row] = now;
            }
          }
        }
      };

      const getCoverage = (now: number) => {
        let painted = 0;
        const total = cols * rows;
        if (total === 0) return 0;

        for (let col = 0; col < cols; col++) {
          for (let row = 0; row < rows; row++) {
            if (isBlockPainted(blockPaintTime[col][row], now)) {
              painted++;
            }
          }
        }
        return painted / total;
      };

      const endGame = (result: "won" | "lost") => {
        if (gameEnded) return;
        gameEnded = true;
        setGameResult(result);
        setGameLive(false);
        setMessage("");
        s.noLoop();
      };

      s.setup = () => {
        const { width, height } = getGameCanvasDimensions();
        createGameCanvas(s, width, height);
        initGrid();
        gameStartMs = s.millis();
        x = s.random(0, s.width);
        y = s.random(0, s.height);
      };

      s.windowResized = () => {
        resizeGameCanvasToLayout(s);
        initGrid();
      };

      s.mousePressed = () => {
        if (gameEnded) return;
        const cap = maxSizeScale();
        sizeScale = Math.min(sizeScale, cap);
        const radius = baseRadius() * sizeScale;
        sizeScale = growScaleOnCircleClick(s, x, y, radius, sizeScale, cap);

        const dx = s.mouseX - x;
        const dy = s.mouseY - y;
        const dist = Math.hypot(dx, dy) || 1;
        const nudge = 60 * screenScale() * movementSpeedMultiplier();
        x += (dx / dist) * nudge;
        y += (dy / dist) * nudge;
        x = s.constrain(x, 0, s.width);
        y = s.constrain(y, 0, s.height);
      };

      s.draw = () => {
        if (gameEnded) return;

        const now = s.millis();
        const holding = s.mouseIsPressed;
        const cap = maxSizeScale();
        sizeScale = Math.min(sizeScale, cap);
        const radius = baseRadius() * sizeScale;
        const baseSpeed = cap > 1 ? 5 + ((sizeScale - 1) / (cap - 1)) * 2.5 : 5;
        const speed = baseSpeed * movementSpeedMultiplier();

        const stepSpeed = speed / MOTION_TRAIL_STEPS;
        const herdFactor = holding ? 1.2 / MOTION_TRAIL_STEPS : 0;

        runMotionTrailFrame(
          s,
          () => {
            drawSettingsCircle(s, x, y, radius * 2, live());

            x += stepSpeed;
            y -= stepSpeed;
            if (x > s.width) x = 0;
            if (y < 0) y = s.height;
            if (x < 0) x = s.width;
            if (y > s.height) y = 0;

            if (holding) {
              const dx = s.mouseX - x;
              const dy = s.mouseY - y;
              const dist = Math.hypot(dx, dy) || 1;
              x += (dx / dist) * speed * herdFactor;
              y += (dy / dist) * speed * herdFactor;
            }

            const j = live().jiggliness;
            x += s.random(-j, j);
            y += s.random(-j, j);
            x = s.constrain(x, 0, s.width);
            y = s.constrain(y, 0, s.height);
          },
          { alpha: TRAIL_FADE_ALPHA_LONG }
        );

        paintBlocks(x, y, radius, now);

        if (isPointerOverCircle(s, x, y, radius)) {
          s.cursor("pointer");
        } else {
          s.cursor(holding ? "grabbing" : "default");
        }

        const coverage = getCoverage(now);

        if (coverage >= WIN_COVERAGE) {
          if (aboveThresholdSince === 0) aboveThresholdSince = now;
          if (now - aboveThresholdSince >= WIN_HOLD_MS) {
            endGame("won");
            return;
          }
        } else {
          aboveThresholdSince = 0;
        }

        const elapsed = now - gameStartMs;
        if (elapsed > 2000 && coverage === 0) {
          endGame("lost");
          return;
        }
        if (elapsed >= GAME_TIME_MS) {
          endGame("lost");
        }
      };
    },
    [settingsRef, setGameResult, setGameLive, setMessage]
  );

  return <ReactP5Wrapper sketch={sketch} />;
};

export default Level03;
