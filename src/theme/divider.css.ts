import { oryTheme } from "./theme.css"
import { pxToEm, pxToRem } from "../common"
import { recipe, RecipeVariants } from "@vanilla-extract/recipes"
import { style } from "@vanilla-extract/css"

export const dividerTextStyle = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  selectors: {
    "&::before,&::after": {
      content: "''",
      height: pxToRem(4),
      flexGrow: 1,
      backgroundColor: oryTheme.border.def,
    },
    "&::before": {
      marginRight: pxToEm(4),
    },
    "&::after": {
      marginLeft: pxToEm(4),
    },
  },
})

export const dividerStyle = recipe({
  base: {
    display: "block",
    textAlign: "center",
    overflow: "hidden",
    boxSizing: "border-box",
    border: 0,
    borderTop: `${pxToRem(4)} solid`,
    borderColor: oryTheme.border.def,
    width: pxToRem(64),
  },
  variants: {
    sizes: {
      fullWidth: {
        width: "100%",
      },
    },
  },
})

// Get the type
export type DividerStyle = RecipeVariants<typeof dividerStyle>
