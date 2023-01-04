// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { recipe, RecipeVariants } from "@vanilla-extract/recipes"
import { pxToRem } from "../common"

export const gridStyle = recipe({
  base: {
    display: "flex",
    flexDirection: "column",
    gap: pxToRem(16),
    overflow: "auto",
  },
  variants: {
    direction: {
      row: {
        flexDirection: "row",
      },
      column: {
        flexDirection: "column",
      },
    },
    gap: {
      4: {
        gap: pxToRem(4),
      },
      8: {
        gap: pxToRem(8),
      },
      16: {
        gap: pxToRem(16),
      },
      24: {
        gap: pxToRem(24),
      },
      32: {
        gap: pxToRem(32),
      },
      64: {
        gap: pxToRem(64),
      },
    },
  },
})

// Get the type
export type GridStyle = RecipeVariants<typeof gridStyle>
