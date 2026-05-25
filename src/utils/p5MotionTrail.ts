import { P5CanvasInstance } from "react-p5-wrapper";
import { getGameCanvasDimensions } from "../constants/canvas";
import { Settings } from "../components/CircleSettings";
import { hexToRgb, resolveCircleColors, setCircleDrawTheme } from "./circleColors";

export { setCircleDrawTheme };

/** Canvas fill — updated when the UI theme changes */
let canvasBg: [number, number, number] = [50, 89, 100];

export const setMotionTrailCanvasBg = (rgb: [number, number, number]) => {
  canvasBg = rgb;
  const css = `rgb(${rgb.join(",")})`;
  document.querySelectorAll("canvas").forEach((el) => {
    el.style.background = css;
  });
};

export const getMotionTrailCanvasBg = (): [number, number, number] => canvasBg;

/** Default fade — lower alpha = longer circle imprints */
export const TRAIL_FADE_ALPHA = 12;

/** Softer fade for fast-moving levels (longer ghosts) */
export const TRAIL_FADE_ALPHA_LONG = 8;

export const MOTION_TRAIL_STEPS = 6;

/** Full clear — use in setup and on resize */
export const clearCanvasBackground = (s: P5CanvasInstance) => {
  s.background(...canvasBg);
};

/** Create canvas and paint teal immediately so p5's default white never shows */
export const createGameCanvas = (
  s: P5CanvasInstance,
  width: number,
  height: number
) => {
  const canvas = s.createCanvas(width, height);
  clearCanvasBackground(s);
  canvas.elt.style.background = `rgb(${canvasBg.join(",")})`;
  return canvas;
};

type P5WithRenderer = P5CanvasInstance & {
  _renderer?: { resize: (w: number, h: number) => void };
};

/** Resize without p5.resizeCanvas() — it copies every drawingContext key and can throw on read-only props (e.g. serial) */
export const resizeGameCanvas = (
  s: P5CanvasInstance,
  width: number,
  height: number
) => {
  if (s.width === width && s.height === height) return;

  const renderer = (s as P5WithRenderer)._renderer;
  if (renderer) {
    renderer.resize(width, height);
    s.width = width;
    s.height = height;
    clearCanvasBackground(s);
    return;
  }

  s.resizeCanvas(width, height);
  clearCanvasBackground(s);
};

/** Resize to viewport minus header and (on mobile) level advice footer */
export const resizeGameCanvasToLayout = (s: P5CanvasInstance) => {
  const { width, height } = getGameCanvasDimensions();
  resizeGameCanvas(s, width, height);
};

const MIN_LAYOUT_SIZE = 50;

/** Wait until layout has non-zero size (avoids 0-height canvas on first paint) */
export const initGameCanvas = (
  s: P5CanvasInstance,
  afterCreate?: () => void
) => {
  const attempt = () => {
    const { width, height } = getGameCanvasDimensions();
    if (width < MIN_LAYOUT_SIZE || height < MIN_LAYOUT_SIZE) {
      requestAnimationFrame(attempt);
      return;
    }
    createGameCanvas(s, width, height);
    afterCreate?.();
  };
  attempt();
};

/** Semi-transparent overlay instead of clearing — leaves motion blur trails */
export const fadeMotionTrail = (
  s: P5CanvasInstance,
  alpha: number = TRAIL_FADE_ALPHA
) => {
  s.noStroke();
  s.fill(canvasBg[0], canvasBg[1], canvasBg[2], alpha);
  s.rect(0, 0, s.width, s.height);
};

export const drawSettingsCircle = (
  s: P5CanvasInstance,
  x: number,
  y: number,
  size: number,
  settings: Pick<Settings, "colour1" | "colour2">
) => {
  const { fill: fillHex, stroke: strokeHex } = resolveCircleColors(settings);

  s.push();
  // s.strokeWeight(Math.max(2, size * 0.03));
  s.stroke(...hexToRgb(strokeHex));
  s.fill(...hexToRgb(fillHex));
  s.ellipse(x, y, size, size);
  s.pop();
};

type MotionTrailOptions = {
  steps?: number;
  alpha?: number;
};

/**
 * Fade the canvas, then run `steps` draw passes so circle imprints stack
 * (motion blur / chemtrail). Call drawSettingsCircle inside onStep.
 */
export const runMotionTrailFrame = (
  s: P5CanvasInstance,
  onStep: (step: number) => void,
  options: MotionTrailOptions = {}
) => {
  const steps = options.steps ?? MOTION_TRAIL_STEPS;
  const alpha = options.alpha ?? TRAIL_FADE_ALPHA;

  fadeMotionTrail(s, alpha);
  for (let i = 0; i < steps; i++) {
    onStep(i);
  }
};
