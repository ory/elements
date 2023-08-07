// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { globalStyle, style } from "@vanilla-extract/css"
import { pxToRem } from "../common"
import { password } from "../test"
import { oryTheme } from "./theme.css"

export const inputFieldTitleStyle = style({
  color: oryTheme.accent.def,
})

// attached to the input field itself
// when using the icon: 'security' variant,
// we expect the container to show the border instead
export const inputFieldStyle = style({
  all: "unset",
  boxSizing: "border-box",
  color: oryTheme.input.text,
  border: `1px solid ${oryTheme.border.def}`,
  borderRadius: pxToRem(4),
  padding: pxToRem(12, 24),
  background: oryTheme.input.background,
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
    "&:not(:focus):not(:placeholder-shown):invalid": {
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

// a div container that wraps the input field with the icon
// this is used when we want an icon on the input field
// we then take over the border styling from the input field on the container
export const passwordInputContainerStyle = style({
  display: "none",
  flexDirection: "row",
  boxSizing: "border-box",
  alignItems: "center",
  gap: 0,
  padding: 0,
  width: "fit-content",
  background: oryTheme.input.background,
  border: `1px solid ${oryTheme.border.def}`,
  borderRadius: pxToRem(4),
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
  },
})

// input field with obfuscated text
// this can be attached to a input[type=text] and act
// as an input[type=password]
// **WARNING**: this is not supported by all browsers
// firefox only recently aded support for this!
// https://caniuse.com/mdn-css_properties_-webkit-text-security
export const inputFieldSecurityStyle = style({
  all: "unset",
  boxSizing: "border-box",
  color: oryTheme.input.text,
  borderRadius: pxToRem(4),
  padding: pxToRem(12, 24),
  background: oryTheme.input.background,
  border: "none",
  margin: 0,
  selectors: {
    "&:hover": {
      border: `none`,
    },
    "&:focus": {
      border: `none`,
    },
    "&:active": {
      border: `none`,
    },
    "&:disabled": {
      border: `none`,
    },
  },
  ["-webkit-text-security"]: "disc",
})

// this is attached to a checkbox that toggles the visibility of the input field
// we don't want to show the checkbox, but we want to show the label
export const inputFieldVisibilityToggleStyle = style({
  cursor: "pointer",
  WebkitAppearance: "none",
  MozAppearance: "none",
  appearance: "none",
  display: "none",
  userSelect: "none",
  MozUserSelect: "none",
  WebkitUserSelect: "none",
})

// this is a label attached to the checkbox that toggles the visibility of the input field
// we don't want to show the checkbox, but we want to show the label
export const inputFieldVisibilityToggleLabelStyle = style({
  cursor: "pointer",
  WebkitAppearance: "none",
  MozAppearance: "none",
  appearance: "none",
  userSelect: "none",
  MozUserSelect: "none",
  WebkitUserSelect: "none",
  margin: pxToRem(0, 18, 0, 0),
})

globalStyle(
  `${inputFieldVisibilityToggleStyle}:checked ~ label svg:last-child`,
  {
    display: "none",
  },
)

globalStyle(
  `${inputFieldVisibilityToggleStyle}:not(:checked) ~ label svg:first-child`,
  {
    display: "none",
  },
)

globalStyle(
  `${inputFieldSecurityStyle}:not(:focus):not(:placehoder-shown):valid > ${passwordInputContainerStyle}`,
  {
    border: `1px solid ${oryTheme.success.emphasis}`,
  },
)

globalStyle(
  `${inputFieldSecurityStyle}:not(:focus):not(:placeholder-shown):invalid > ${passwordInputContainerStyle}`,
  {
    border: `1px solid ${oryTheme.error.emphasis}`,
  },
)

globalStyle(
  `${inputFieldSecurityStyle}:disabled > ${passwordInputContainerStyle}`,
  {
    border: `1px solid ${oryTheme.input.disabled}`,
  },
)

globalStyle(
  `${inputFieldVisibilityToggleStyle}:checked ~ ${inputFieldSecurityStyle}`,
  {
    ["-webkit-text-security"]: "none",
  },
)

globalStyle(`${passwordInputContainerStyle}`, {
  "@supports": {
    "(-webkit-text-security: disc)": {
      display: "flex",
    },
  },
})

globalStyle(
  `${passwordInputContainerStyle}:[display=flex] ~ ${inputFieldStyle}`,
  {
    display: "none",
  },
)
