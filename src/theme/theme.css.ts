import {
  createGlobalTheme,
  globalStyle,
} from "@vanilla-extract/css";

import {defaultFont, defaultLightTheme} from "./consts";

export const oryTheme = createGlobalTheme(":root", {
  ...defaultFont,
  ...defaultLightTheme
})

globalStyle('html, body', {
  textRendering: "geometricPrecision",
  fontFamily: oryTheme.fontFamily,
  fontStyle: oryTheme.fontStyle,
  boxSizing: "border-box",
});
