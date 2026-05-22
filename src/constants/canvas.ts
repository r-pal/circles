const MD_BREAKPOINT = 768;
const HEADER_FALLBACK_HEIGHT = 48;
const FOOTER_FALLBACK_HEIGHT = 48;

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

/** Size to the flex middle panel, or viewport minus measured chrome */
export const getGameCanvasDimensions = () => {
  const stage = document.getElementById("game-stage");
  if (stage && stage.clientWidth > 0 && stage.clientHeight > 0) {
    return {
      width: stage.clientWidth,
      height: stage.clientHeight,
    };
  }

  const header = getHeaderHeight();
  const footer = getMobileAdviceFooterHeight();
  return {
    width: document.documentElement.clientWidth,
    height: Math.max(0, window.innerHeight - header - footer),
  };
};
