import { useRef } from "react";

/** Keep a callback fresh for p5 handlers without changing sketch dependencies */
export const useLiveCallback = <T extends (...args: never[]) => unknown>(
  fn: T
) => {
  const ref = useRef(fn);
  ref.current = fn;
  return ref;
};
