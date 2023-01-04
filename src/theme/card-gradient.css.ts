// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { style } from "@vanilla-extract/css"
import { recipe } from "@vanilla-extract/recipes"
import { pxToRem } from "../common"
import { defaultBreakpoints } from "./consts"
import { oryTheme } from "./theme.css"

export const cardContainer = style({
  display: "flex",
  flexDirection: "column",
  textDecoration: "none",
  alignItems: "stretch",
  border: `1px solid ${oryTheme.border.def}`,
  maxWidth: pxToRem(209),
  minWidth: pxToRem(209),
  minHeight: pxToRem(312),
  borderRadius: pxToRem(4),
  padding: pxToRem(24),
  filter:
    "drop-shadow(0px 0px 1px rgba(48, 49, 51, 0.05)) drop-shadow(0px 8px 16px rgba(48, 49, 51, 0.1))",
  "@media": {
    [`screen and (max-width: ${defaultBreakpoints.xs})`]: {
      width: "100%",
      border: "0px",
      borderRadius: "0px",
      maxWidth: pxToRem(294),
      minWidth: pxToRem(294),
    },
  },
})

export const cardGradientOverlayStyle = recipe({
  base: {
    background: oryTheme.accent.def,
    cursor: "pointer",
    position: "relative",
  },
  defaultVariants: { disabled: false },
  variants: {
    disabled: {
      true: {
        background: oryTheme.foreground.disabled,
        cursor: "default",
      },
      false: {
        selectors: {
          "&:before": {
            content: " ",
            display: "block",
            position: "absolute",
            opacity: "0.5",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            background:
              "linear-gradient(180deg, rgba(48, 48, 48, 0.85) 1.22%, rgba(48, 48, 48, 0.0001) 100%)",
            backgroundSize: "cover",
            zIndex: -1,
          },
          "&:hover:before": {
            opacity: "0.9",
          },
        },
      },
    },
  },
})

export const cardGradientActionStyle = recipe({
  base: {
    marginRight: "auto",
    marginTop: "auto",
    width: pxToRem(40),
    height: pxToRem(40),
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    fontSize: pxToRem(27),
    color: oryTheme.foreground.onAccent,
  },
  defaultVariants: { disabled: false },
  variants: {
    disabled: {
      true: {
        color: oryTheme.foreground.onDisabled,
      },
      false: {
        selectors: {
          [`${cardContainer}:hover &`]: {
            width: pxToRem(48),
          },
        },
      },
    },
  },
})
