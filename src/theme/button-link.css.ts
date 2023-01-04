// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { style } from "@vanilla-extract/css"
import { recipe, RecipeVariants } from "@vanilla-extract/recipes"
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

export const buttonLinkContainerStyle = recipe({
  base: {
    display: "flex",
    alignItems: "center",
  },
  defaultVariants: {
    position: "inline",
  },
  variants: {
    position: {
      inline: {
        display: "inline-flex",
      },
      left: {
        justifyContent: "left",
        // TODO: This might not be suitable for all future variants, adjust at your own discretion
        width: "100%",
      },
      center: {
        justifyContent: "center",
        // TODO: This might not be suitable for all future variants, adjust at your own discretion
        width: "100%",
      },
      right: {
        justifyContent: "right",
        // TODO: This might not be suitable for all future variants, adjust at your own discretion
        width: "100%",
      },
    },
  },
})

export type ButtonLinkContainerStyle = RecipeVariants<
  typeof buttonLinkContainerStyle
>

export const buttonLinkIconStyle = style({
  paddingRight: pxToRem(8),
})
