import { style } from "@vanilla-extract/css"
import { recipe } from "@vanilla-extract/recipes"
import { pxToRem } from "../common"
import { oryTheme } from "./theme.css"

export const buttonLinkStyle = recipe({
  base: {
    cursor: "pointer",
    textDecoration: "none",
    color: oryTheme.accent.def,
    ":disabled": {
      color: oryTheme.foreground.disabled,
    },
    ":hover": {
      color: oryTheme.accent.muted,
    },
    ":active": {
      color: oryTheme.accent.emphasis,
    },
    ":focus": {
      color: oryTheme.accent.muted,
    },
  },
})

export const buttonLinkIconStyle = style({
  paddingRight: pxToRem(8),
})
