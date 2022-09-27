import { style } from "@vanilla-extract/css"
import { recipe, RecipeVariants } from "@vanilla-extract/recipes"
import { pxToRem } from "../common"
import { defaultBreakpoints } from "./consts"
import { oryTheme } from "./theme.css"

export const buttonSocialStyle = recipe({
  base: {
    all: "unset",
    boxSizing: "border-box",
    fontFamily: "Inter",
    textDecoration: "none",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    color: oryTheme.foreground.muted,
    borderColor: oryTheme.foreground.muted,
    backgroundColor: "inherit",
    border: "1px solid",
    borderRadius: pxToRem(4),
    cursor: "pointer",
    outline: "none",
    padding: pxToRem(12, 16),
    ":disabled": {
      color: oryTheme.foreground.disabled,
      borderColor: oryTheme.accent.disabled,
    },
    ":hover": {
      borderColor: oryTheme.foreground.subtle,
    },
    ":focus": {
      borderColor: oryTheme.foreground.subtle,
      outline: "none",
    },
    ":active": {
      color: oryTheme.foreground.onDark,
      backgroundColor: oryTheme.foreground.def,
      outline: "none",
    },
    "@media": {
      [`screen and (min-width: ${defaultBreakpoints.lg})`]: {
        fontSize: pxToRem(18),
        lineHeight: pxToRem(32),
        padding: pxToRem(16, 24),
      },
      [`screen and (min-width: ${defaultBreakpoints.md})`]: {
        fontSize: pxToRem(16),
        lineHeight: pxToRem(28),
      },
      [`screen and (min-width: ${defaultBreakpoints.sm})`]: {
        fontSize: pxToRem(14),
        lineHeight: pxToRem(20),
      },
    },
    selectors: {
      "&:hover:disabled, &:disabled": {
        color: oryTheme.foreground.disabled,
        borderColor: oryTheme.accent.disabled,
      },
    },
  },
  variants: {
    size: {
      small: {
        fontSize: pxToRem(14),
        lineHeight: pxToRem(20),
      },
      medium: {
        fontSize: pxToRem(16),
        lineHeight: pxToRem(28),
      },
      large: {
        fontSize: pxToRem(18),
        lineHeight: pxToRem(32),
        padding: pxToRem(16, 24),
      },
    },
    variant: {
      regular: {
        fontWeight: 400,
        fontStyle: "normal",
      },
      semibold: {
        fontWeight: 600,
        fontStyle: "normal",
      },
    },
  },
})

export const buttonSocialTitleStyle = style({
  display: "flex",
  alignItems: "center",
  textAlign: "center",
  margin: "auto",
})

export const buttonSocialIconStyle = recipe({
  base: {},
  defaultVariants: { position: "start" },
  variants: {
    position: {
      start: {
        paddingRight: pxToRem(16),
        "@media": {
          [`screen and (min-width: ${defaultBreakpoints.lg})`]: {
            paddingRight: pxToRem(24),
          },
        },
      },
      end: {
        paddingLeft: pxToRem(16),
        "@media": {
          [`screen and (min-width: ${defaultBreakpoints.lg})`]: {
            paddingLeft: pxToRem(24),
          },
        },
      },
    },
    size: {
      small: {},
      medium: {},
      large: {
        paddingRight: pxToRem(24),
        fontSize: pxToRem(24),
      },
    },
  },
})

// Get the type
export type ButtonSocialStyle = RecipeVariants<typeof buttonSocialStyle>
