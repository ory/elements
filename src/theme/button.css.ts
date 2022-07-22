import {
  accentDefaultColor,
  accentEmphasisColor,
  accentMutedColor,
  textDefaultColor,
  textDisabledColor
} from "./theme.css";
import {pxToRem} from "../utils";
import {recipe} from "@vanilla-extract/recipes";

export const button = recipe({
  base: {
    color: textDefaultColor,
    width: '100%',
    minHeight: pxToRem(48),
    ":disabled": {
      backgroundColor: textDisabledColor,
    },
    ":hover": {
      backgroundColor: accentMutedColor,
    },
    ":focus": {
      backgroundColor: accentDefaultColor,
      borderColor: accentMutedColor,
      outline: "none"
    },
    ":active": {
      backgroundColor: accentEmphasisColor,
      outline: "none"
    }
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
