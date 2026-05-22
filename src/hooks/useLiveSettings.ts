import { useRef } from "react";
import type { Settings } from "../components/CircleSettings";

/** Latest settings for p5 draw loops without remounting the sketch on theme change */
export const useLiveSettings = (settings: Settings) => {
  const ref = useRef(settings);
  ref.current = settings;
  return ref;
};
