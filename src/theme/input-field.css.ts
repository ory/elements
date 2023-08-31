// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { globalStyle, style } from "@vanilla-extract/css"
import { pxToRem } from "../common"
import { oryTheme } from "./theme.css"

export const inputFieldTitleStyle = style({
  color: oryTheme.accent.def,
})

export const inputFieldStyle = style({
  all: "unset",
  boxSizing: "border-box",
  display: "inline-flex",
  color: oryTheme.input.text,
  border: `1px solid ${oryTheme.border.def}`,
  borderRadius: pxToRem(4),
  padding: pxToRem(12, 24),
  background: oryTheme.input.background,
  width: "100%",
  selectors: {
    "&:hover": {
      borderColor: oryTheme.accent.muted,
    },
    "&:focus": {
      borderColor: oryTheme.accent.muted,
    },
    "&:active": {
      borderColor: oryTheme.accent.emphasis,
    },
    "&:not(:focus):not(:placeholder-shown):invalid": {
      borderColor: oryTheme.error.emphasis,
    },
    "&:not(:focus):not(:placeholder-shown):valid": {
      borderColor: oryTheme.success.emphasis,
    },
    "&:disabled": {
      borderColor: oryTheme.input.disabled,
    },
  },
})

export const inputFieldVisibilityToggleLabelStyle = style({
  cursor: "pointer",
  WebkitAppearance: "none",
  MozAppearance: "none",
  appearance: "none",
  userSelect: "none",
  MozUserSelect: "none",
  WebkitUserSelect: "none",
  margin: pxToRem(0, 18, 0, 0),
  // display: "inline-flex",
  right: 0,
  top: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  position: "absolute",
})

globalStyle(
  `${inputFieldVisibilityToggleLabelStyle}[data-checked="true"] svg:last-child`,
  {
    display: "none",
  },
)

globalStyle(
  `${inputFieldVisibilityToggleLabelStyle}[data-checked="false"] svg:first-child`,
  {
    display: "none",
  },
)
