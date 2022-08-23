import { style } from "@vanilla-extract/css"
import { pxToRem } from "../common"
import { oryTheme } from "./theme.css"
import { recipe, RecipeVariants } from "@vanilla-extract/recipes"
import { defaultBreakpoints } from "./consts"

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

// recipe for the card style
// this ensures we have themeable variations for the card
export const cardStyle = recipe({
  base: card,
})

// Get the type
export type CardStyle = RecipeVariants<typeof cardStyle>
