// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { recipe, RecipeVariants } from "@vanilla-extract/recipes"
import { pxToRem } from "../common"
import { oryTheme } from "./theme.css"

export const inputTypographyStyle = recipe({
  base: {
    fontFamily: oryTheme.fontFamily,
    textDecoration: "none",
  },

  defaultVariants: {
    size: 16,
    type: "regular",
  },

  variants: {
    size: {
      16: {
        fontSize: pxToRem(16),
        lineHeight: pxToRem(24),
      },
      18: {
        fontSize: pxToRem(18),
        lineHeight: pxToRem(32),
      },
    },
    type: {
      regular: {
        fontWeight: 400,
        fontStyle: "normal",
      },
      semiBold: {
        fontWeight: 600,
        fontStyle: "normal",
      },
    },
  },
})

export type InputTypographyStyle = RecipeVariants<typeof inputTypographyStyle>

export const typographyStyle = recipe({
  base: {
    fontFamily: oryTheme.fontFamily,
    textDecoration: "none",
  },

  defaultVariants: {
    type: "regular",
  },

  variants: {
    size: {
      tiny: {
        fontSize: pxToRem(10),
        lineHeight: pxToRem(16),
      },
      xsmall: {
        fontSize: pxToRem(12),
        lineHeight: pxToRem(20),
      },
      small: {
        fontSize: pxToRem(16),
        lineHeight: pxToRem(28),
      },
      caption: {
        fontSize: pxToRem(14),
        lineHeight: pxToRem(20),
      },
      body: {
        fontSize: pxToRem(18),
        lineHeight: pxToRem(32),
      },
      lead: {
        fontSize: pxToRem(24),
        lineHeight: pxToRem(36),
      },
      headline21: {
        fontSize: pxToRem(21),
        lineHeight: pxToRem(32),
      },
      headline26: {
        fontSize: pxToRem(26),
        lineHeight: pxToRem(40),
      },
      headline31: {
        fontSize: pxToRem(31),
        lineHeight: pxToRem(48),
      },
      headline37: {
        fontSize: pxToRem(37),
        lineHeight: pxToRem(52),
      },
      headline48: {
        fontSize: pxToRem(48),
        lineHeight: pxToRem(60),
      },
      display: {
        fontSize: pxToRem(64),
        lineHeight: pxToRem(80),
      },
      hero: {
        fontSize: pxToRem(80),
        lineHeight: pxToRem(96),
      },
      uber: {
        fontSize: pxToRem(112),
        lineHeight: pxToRem(120),
      },
      colossus: {
        fontSize: pxToRem(140),
        lineHeight: pxToRem(144),
      },
      monoCaption: {
        fontFamily: oryTheme.fontFamilyMono,
        fontSize: pxToRem(14),
        lineHeight: pxToRem(20),
      },
    },
    type: {
      regular: {
        fontWeight: 400,
        fontStyle: "normal",
      },
      bold: {
        fontWeight: 700,
        fontStyle: "normal",
      },
    },
  },
})

export type TypographyStyle = RecipeVariants<typeof typographyStyle>
