import { style } from "@vanilla-extract/css"
import { recipe, RecipeVariants } from "@vanilla-extract/recipes"
import { pxToRem } from "../common"
import { defaultBreakpoints } from "./consts"
import { oryTheme } from "./theme.css"

// the base card style with media queries
const card = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  border: `1px solid ${oryTheme.border.def}`,
  borderRadius: pxToRem(16),
  padding: pxToRem(48),
  background: oryTheme.background.surface,
  color: oryTheme.foreground.def,
  maxWidth: pxToRem(336),
  minWidth: pxToRem(336),
  "@media": {
    [`screen and (max-width: ${defaultBreakpoints.xs})`]: {
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
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: pxToRem(42),
})

// recipe for the card style
// this ensures we have themeable variations for the card
export const cardStyle = recipe({
  base: card,
})

// Get the type
export type CardStyle = RecipeVariants<typeof cardStyle>
