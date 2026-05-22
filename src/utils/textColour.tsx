import { colours } from "../constants/colours";

export const secondaryColour = (selectedColourHex: string) => {
  for (const c of colours) {
    if (c.primary === selectedColourHex) return c.secondary;
  }
  return selectedColourHex;
};
