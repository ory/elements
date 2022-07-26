import {
  oryTheme,
} from "./theme.css";

import {pxToRem} from "../utils";
import {recipe, RecipeVariants} from "@vanilla-extract/recipes";
import {buttonTypographyStyle} from "./typography.css";

export const buttonStyle = recipe({
  base: {
    color: oryTheme.text.default,
    width: '100%',
    minHeight: pxToRem(48),
    ":disabled": {
      backgroundColor: oryTheme.text.disabled,
    },
    ":hover": {
      backgroundColor: oryTheme.accent.muted,
    },
    ":focus": {
      backgroundColor: oryTheme.accent.default,
      borderColor: oryTheme.accent.muted,
      outline: "none"
    },
    ":active": {
      backgroundColor: oryTheme.accent.emphasis,
      outline: "none"
    },
    '@media': {
      [`screen and (min-width: ${oryTheme.breakpoints.lg})`]: {
        width: 'auto',
      },
      [`screen and (max-width: ${oryTheme.breakpoints.md})`]: buttonTypographyStyle({size: 16, type: 'semiBold'}),
      [`screen and (max-width: ${oryTheme.breakpoints.sm})`]: buttonTypographyStyle({size: 14, type: 'semiBold'}),
    },
  },
  variants: {
    small: {
      minHeight: pxToRem(40),
    },
    large: {
      minHeight: pxToRem(64),
    }
  },
})

// Get the type
export type ButtonStyle = RecipeVariants<typeof buttonStyle>;

/*export const buttonText = style({
  selectors: {
    [`${button}`]: {
      '@media': {
        [`screen and (min-width: ${theme.breakpoints.md})`]: theme.typography.button.medium,
        [`screen and (min-width: ${theme.breakpoints.lg})`]: theme.typography.button.large,
        [`screen and (min-width: 0) and (max-width: ${theme.breakpoints.sm})`]: theme.typography.button.small,
      },
    }
  }
})*/
