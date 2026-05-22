const MD_BREAKPOINT = 768;
const HEADER_FALLBACK_HEIGHT = 48;
const FOOTER_FALLBACK_HEIGHT = 48;
const MIN_CANVAS_SIZE = 50;

export type GameCanvasLayout = {
  mobileAdviceFooterVisible: boolean;
};

let layout: GameCanvasLayout = { mobileAdviceFooterVisible: false };

export const setGameCanvasLayout = (partial: Partial<GameCanvasLayout>) => {
  layout = { ...layout, ...partial };
};

export const getHeaderHeight = () => {
  const el = document.getElementById("app-header");
  return el?.offsetHeight ?? HEADER_FALLBACK_HEIGHT;
};

export const getMobileAdviceFooterHeight = () => {
  if (window.innerWidth >= MD_BREAKPOINT) return 0;
  if (!layout.mobileAdviceFooterVisible) return 0;

  const el = document.getElementById("level-advice-footer");
  return el?.offsetHeight ?? FOOTER_FALLBACK_HEIGHT;
};

/** Match header width; height from game-stage or viewport minus chrome */
export const getGameCanvasDimensions = () => {
  const header = document.getElementById("app-header");
  const footer = document.getElementById("level-advice-footer");
  const stage = document.getElementById("game-stage");

  const width = Math.round(
    header?.offsetWidth ??
      stage?.clientWidth ??
      document.documentElement.clientWidth
  );

  let height = 0;
  if (stage) {
    const rect = stage.getBoundingClientRect();
    if (rect.height > 0) height = Math.round(rect.height);
  }

  if (height < MIN_CANVAS_SIZE) {
    const headerH = header?.offsetHeight ?? HEADER_FALLBACK_HEIGHT;
    const footerH =
      footer && footer.offsetHeight > 0
        ? footer.offsetHeight
        : getMobileAdviceFooterHeight();
    height = Math.round(window.innerHeight - headerH - footerH);
  }

  return {
    width: Math.max(MIN_CANVAS_SIZE, width),
    height: Math.max(MIN_CANVAS_SIZE, height),
  };
};
