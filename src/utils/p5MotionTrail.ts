import { P5CanvasInstance } from "react-p5-wrapper";
import { getGameCanvasDimensions } from "../constants/canvas";
import { Settings } from "../components/CircleSettings";

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

export const resizeGameCanvas = (
  s: P5CanvasInstance,
  width: number,
  height: number
) => {
  s.resizeCanvas(width, height);
  clearCanvasBackground(s);
};

/** Resize to viewport minus header and (on mobile) level advice footer */
export const resizeGameCanvasToLayout = (s: P5CanvasInstance) => {
  const { width, height } = getGameCanvasDimensions();
  resizeGameCanvas(s, width, height);
};

/** Semi-transparent overlay instead of clearing — leaves motion blur trails */
export const fadeMotionTrail = (
  s: P5CanvasInstance,
  alpha: number = TRAIL_FADE_ALPHA
) => {
  s.noStroke();
  const c = s.color(...canvasBg);
  c.setAlpha(alpha);
  s.fill(c);
  s.rect(0, 0, s.width, s.height);
};

export const drawSettingsCircle = (
  s: P5CanvasInstance,
  x: number,
  y: number,
  size: number,
  settings: Pick<Settings, "colour1" | "colour2">
) => {
  s.fill(settings.colour1);
  s.stroke(settings.colour2);
  s.ellipse(x, y, size, size);
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
