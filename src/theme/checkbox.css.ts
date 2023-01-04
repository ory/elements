// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { style } from "@vanilla-extract/css"
import { pxToRem } from "../common"
import { oryTheme } from "./theme.css"

export const checkboxStyle = style({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  cursor: "pointer",
  gap: pxToRem(8),
})

export const checkboxInputStyle = style({
  cursor: "pointer",
  WebkitAppearance: "none",
  MozAppearance: "none",
  appearance: "none",
  minWidth: pxToRem(18),
  minHeight: pxToRem(18),
  maxHeight: pxToRem(18),
  maxWidth: pxToRem(18),
  border: `2px solid ${oryTheme.accent.def}`,
  borderRadius: pxToRem(4),
  margin: pxToRem(3),
  color: oryTheme.accent.def,
  selectors: {
    "&:checked": {
      background: oryTheme.accent.def,
    },
    "&:checked::before": {
      fontFamily: "'Font Awesome 6 Free'", // this is required for the fontawesome icon to work
      fontSize: pxToRem(13),
      display: "block",
      textAlign: "center",
      position: "relative",
      content: "\\f00c", // this is a fontawesome unicode character to switch back to a basic html checkmark use \\2713
      color: "white",
      fontWeight: "900",
    },
  },
  ":disabled": {
    borderColor: oryTheme.accent.disabled,
  },
})
