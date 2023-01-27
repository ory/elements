// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { style } from "@vanilla-extract/css"
import { oryTheme } from "./theme.css"

export const themeProviderStyle = style({
  fontFamily: oryTheme.fontFamily,
  fontStyle: oryTheme.fontStyle,
  boxSizing: "border-box",
})

export const themeProviderFontRenderingStyle = style({
  textRendering: "geometricPrecision",
  WebkitFontSmoothing: "antialiased",
})
