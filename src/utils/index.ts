export {
  MOTION_TRAIL_STEPS,
  TRAIL_FADE_ALPHA,
  TRAIL_FADE_ALPHA_LONG,
  clearCanvasBackground,
  createGameCanvas,
  initGameCanvas,
  drawSettingsCircle,
  fadeMotionTrail,
  getMotionTrailCanvasBg,
  resizeGameCanvas,
  resizeGameCanvasToLayout,
  runMotionTrailFrame,
  setMotionTrailCanvasBg,
  setCircleDrawTheme,
} from "./p5MotionTrail";

export { resolveCircleColors } from "./circleColors";

export {
  CLICK_GROW_STEP,
  MAX_CLICK_SCALE,
  growScaleOnCircleClick,
  isPointerOverCircle,
} from "./p5CircleClickGrow";

export {
  RUN_TIMER_TICK_MS,
  formatRunTime,
  totalRunTicks,
} from "./speedrunScore";
