import { style } from "@vanilla-extract/css"
import { recipe } from "@vanilla-extract/recipes"
import { pxToRem } from "../common"
import { defaultBreakpoints } from "./consts"
import { oryTheme } from "./theme.css"

export const cardGradientStyle = recipe({
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    border: `1px solid ${oryTheme.border.def}`,
    borderRadius: pxToRem(4),
    padding: pxToRem(24),
    background: oryTheme.accent.def,
    color: oryTheme.foreground.onDark,
    minHeight: pxToRem(312),
    filter:
      "drop-shadow(0px 0px 1px rgba(48, 49, 51, 0.05)) drop-shadow(0px 16px 24px rgba(48, 49, 51, 0.1))",
    backgroundImage:
      "linear-gradient(180deg, rgba(48, 48, 48, 0.85) 1.22%, rgba(48, 48, 48, 0.0001) 100%)",
    maxWidth: pxToRem(209),
    minWidth: pxToRem(209),
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
  },
  variants: {
    disabled: {
      true: {
        background: oryTheme.foreground.disabled,
      },
    },
  },
})

export const cardGradientActionStyle = style({
  marginRight: "auto",
  marginTop: "auto",
  width: pxToRem(40),
  height: pxToRem(40),
  padding: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  textDecoration: "none",
  fontSize: pxToRem(27),
  color: oryTheme.foreground.onAccent,
})
