/** Timer ticks every 100ms; each unit = 0.1s */
export const RUN_TIMER_TICK_MS = 100;

export const formatRunTime = (ticks: number): string => {
  const seconds = ticks / (1000 / RUN_TIMER_TICK_MS);
  return `${seconds.toFixed(1)}s`;
};

export const totalRunTicks = (levelSplits: number[]): number =>
  levelSplits.reduce((sum, split) => sum + split, 0);
