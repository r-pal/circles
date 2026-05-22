const XL_BREAKPOINT = 1280;
const MD_BREAKPOINT = 768;
const XL_BANNER_HEIGHT = 66;
const DEFAULT_BANNER_HEIGHT = 35;
const FOOTER_FALLBACK_HEIGHT = 48;

export type GameCanvasLayout = {
  mobileAdviceFooterVisible: boolean;
};

let layout: GameCanvasLayout = { mobileAdviceFooterVisible: false };

export const setGameCanvasLayout = (partial: Partial<GameCanvasLayout>) => {
  layout = { ...layout, ...partial };
};

export const getBannerHeight = () =>
  window.innerWidth > XL_BREAKPOINT ? XL_BANNER_HEIGHT : DEFAULT_BANNER_HEIGHT;

export const getMobileAdviceFooterHeight = () => {
  if (window.innerWidth >= MD_BREAKPOINT) return 0;
  if (!layout.mobileAdviceFooterVisible) return 0;

  const el = document.getElementById("level-advice-footer");
  return el?.offsetHeight ?? FOOTER_FALLBACK_HEIGHT;
};

export const getGameCanvasDimensions = () => ({
  width: window.innerWidth,
  height:
    window.innerHeight - getBannerHeight() - getMobileAdviceFooterHeight(),
});
