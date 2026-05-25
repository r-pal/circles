export const MD_BREAKPOINT = 768;
export const TABLET_BREAKPOINT = 1024;
export const SMALL_DESKTOP_BREAKPOINT = 1280;
export const LARGE_DESKTOP_BREAKPOINT = 1920;

export type ViewportTier =
  | "mobile"
  | "tablet"
  | "smallDesktop"
  | "largeDesktop"
  | "xlDesktop";

/** Tier from game canvas width (matches layout breakpoints) */
export const getViewportTier = (canvasWidthPx: number): ViewportTier => {
  if (canvasWidthPx < MD_BREAKPOINT) return "mobile";
  if (canvasWidthPx < TABLET_BREAKPOINT) return "tablet";
  if (canvasWidthPx < SMALL_DESKTOP_BREAKPOINT) return "smallDesktop";
  if (canvasWidthPx < LARGE_DESKTOP_BREAKPOINT) return "largeDesktop";
  return "xlDesktop";
};

/** Level 3 circle drift speed multiplier per tier */
export const LEVEL03_MOVEMENT_SPEED: Record<ViewportTier, number> = {
  mobile: 1,
  tablet: 1.25,
  smallDesktop: 1.5,
  largeDesktop: 1.85,
  xlDesktop: 2.25,
};
const HEADER_FALLBACK_HEIGHT = 48;
const FOOTER_FALLBACK_HEIGHT = 48;
const MIN_CANVAS_SIZE = 50;

export const getHeaderHeight = () => {
  const el = document.getElementById("app-header");
  return el?.offsetHeight ?? HEADER_FALLBACK_HEIGHT;
};

/** Height of the mobile level-advice footer when it is in the DOM */
export const getMobileAdviceFooterHeight = () => {
  if (window.innerWidth >= MD_BREAKPOINT) return 0;

  const el = document.getElementById("level-advice-footer");
  if (!el) return 0;
  return el.offsetHeight > 0 ? el.offsetHeight : FOOTER_FALLBACK_HEIGHT;
};

const getViewportHeight = () =>
  Math.round(window.visualViewport?.height ?? window.innerHeight);

/** Canvas size: full width, height fits below header and above mobile footer */
export const getGameCanvasDimensions = () => {
  const header = document.getElementById("app-header");
  const stage = document.getElementById("game-stage");
  const headerH = getHeaderHeight();
  const footerH = getMobileAdviceFooterHeight();

  const width = Math.round(
    header?.offsetWidth ??
      stage?.clientWidth ??
      document.documentElement.clientWidth
  );

  let height = getViewportHeight() - headerH - footerH;

  if (stage) {
    const stageHeight = Math.round(stage.getBoundingClientRect().height);
    if (stageHeight > 0) {
      height = Math.min(height, stageHeight);
    }
  }

  return {
    width: Math.max(MIN_CANVAS_SIZE, width),
    height: Math.max(MIN_CANVAS_SIZE, height),
  };
};

let layoutResizeQueued = false;
let lastLayoutWidth = -1;
let lastLayoutHeight = -1;

/** Debounced window resize for p5 — skips when dimensions are unchanged */
export const scheduleP5LayoutResize = () => {
  if (layoutResizeQueued) return;
  layoutResizeQueued = true;
  requestAnimationFrame(() => {
    layoutResizeQueued = false;
    const { width, height } = getGameCanvasDimensions();
    if (width === lastLayoutWidth && height === lastLayoutHeight) return;
    lastLayoutWidth = width;
    lastLayoutHeight = height;
    window.dispatchEvent(new Event("resize"));
  });
};

export const resetP5LayoutResizeCache = () => {
  lastLayoutWidth = -1;
  lastLayoutHeight = -1;
};
