import { P5CanvasInstance } from "react-p5-wrapper";

export const MAX_CLICK_SCALE = 4;
export const CLICK_GROW_STEP = 0.35;

export const isPointerOverCircle = (
  s: P5CanvasInstance,
  x: number,
  y: number,
  radius: number
) => s.dist(s.mouseX, s.mouseY, x, y) < radius;

/** Bump scale when the click lands on the circle; otherwise unchanged */
export const growScaleOnCircleClick = (
  s: P5CanvasInstance,
  x: number,
  y: number,
  radius: number,
  scale: number
): number => {
  if (!isPointerOverCircle(s, x, y, radius)) return scale;
  return Math.min(MAX_CLICK_SCALE, scale + CLICK_GROW_STEP);
};
