// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { style } from "@vanilla-extract/css"
import { RecipeVariants, recipe } from "@vanilla-extract/recipes"
import { pxToRem } from "../common"
import { defaultBreakpoints } from "./consts"
import { oryTheme } from "./theme.css"

// the base card style with media queries
const base = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  border: `1px solid ${oryTheme.border.def}`,
  borderRadius: pxToRem(16),
  padding: pxToRem(48),
  background: oryTheme.background.surface,
  color: oryTheme.foreground.def,
  boxSizing: "border-box",
  "@media": {
    [`screen and (max-width: ${defaultBreakpoints.sm})`]: {
      width: "100%",
      border: "0px",
      borderRadius: "0px",
      padding: `0px 0px ${pxToRem(32)}`,
      maxWidth: pxToRem(294),
      minWidth: pxToRem(294),
    },
  },
})

export const cardTitleStyle = style({
  textAlign: "center",
})

export const cardTitleImage = style({
  objectFit: "contain",
  maxHeight: pxToRem(42),
})

// recipe for the card style
// this ensures we have themeable variations for the card
export const cardStyle = recipe({
  base,
  variants: {
    size: {
      default: {
        maxWidth: pxToRem(434),
        minWidth: pxToRem(434),
      },
      wide: {
        maxWidth: pxToRem(1200),
        width: "100%",
      },
    },
  },
  defaultVariants: {
    size: "default",
  },
})

// Get the type
export type CardStyle = RecipeVariants<typeof cardStyle>
