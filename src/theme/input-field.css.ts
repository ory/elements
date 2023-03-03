// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { style } from "@vanilla-extract/css"
import { pxToRem } from "../common"
import { oryTheme } from "./theme.css"

export const inputFieldTitleStyle = style({
  color: oryTheme.accent.def,
})

export const inputFieldStyle = style({
  all: "unset",
  boxSizing: "border-box",
  color: oryTheme.input.text,
  background: oryTheme.input.background,
  border: `1px solid ${oryTheme.border.def}`,
  borderRadius: pxToRem(4),
  padding: pxToRem(12, 24),
  selectors: {
    "&:hover": {
      border: `1px solid ${oryTheme.accent.muted}`,
    },
    "&:focus": {
      inset: `4px`,
      borderColor: oryTheme.accent.muted,
    },
    "&:active": {
      border: `1px solid ${oryTheme.accent.emphasis}`,
    },
    "&:not(:placeholder-shown):invalid": {
      border: `1px solid ${oryTheme.error.emphasis}`,
    },
    "&:not(:focus):not(:placeholder-shown):valid": {
      border: `1px solid ${oryTheme.success.emphasis}`,
    },
    "&:disabled": {
      border: `1px solid ${oryTheme.input.disabled}`,
    },
  },
})
