// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  globalStyle,
  GlobalStyleRule,
  ComplexStyleRule,
  style,
} from "@vanilla-extract/css"
import { pxToRem } from "../common"
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
  flexGrow: 1,
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
} as ComplexStyleRule & {
  ["-webkit-text-security"]: "disc"
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
      borderColor: oryTheme.accent.muted,
    },
    "&:focus-within": {
      borderColor: oryTheme.accent.muted,
    },
    [`&:has(${inputFieldSecurityStyle}:active)`]: {
      borderColor: oryTheme.accent.emphasis,
    },
    [`&:has(${inputFieldSecurityStyle}:not(:focus):not(:placeholder-shown):invalid)`]:
      {
        borderColor: oryTheme.error.emphasis,
      },
    [`&:has(${inputFieldSecurityStyle}:not(:focus):not(:placeholder-shown):valid)`]:
      {
        borderColor: oryTheme.success.emphasis,
      },
    [`&:has(${inputFieldSecurityStyle}:disabled)`]: {
      borderColor: oryTheme.input.disabled,
    },
  },
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
  display: "inline-flex",
})

export const inputFieldFallbackWrapperStyle = style({})

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

/**
 * On selecting the visibility checkbox, we want to show the text in the input field
 *
 **/
globalStyle(
  `${inputFieldVisibilityToggleStyle}:checked ~ ${inputFieldSecurityStyle}`,
  {
    ["-webkit-text-security"]: "none",
  } as GlobalStyleRule & {
    ["-webkit-text-security"]: "none"
  },
)

/**
 * Firefox does not support the :has selector yet, so we need to test for this
 * https://caniuse.com/css-has
 * https://caniuse.com/mdn-css_properties_-webkit-text-security
 * If both the :has selector and the -webkit-text-security: disc are supported,
 * we can show the password input field with a visibility toggle
 * and hide the fallback password input field
 **/
globalStyle(`${passwordInputContainerStyle}:has(*)`, {
  "@supports": {
    "(-webkit-text-security: disc)": {
      display: "flex",
    },
  },
})

/**
 * Firefox does not support the :has selector yet, so we need to test for this
 * https://caniuse.com/css-has
 * https://caniuse.com/mdn-css_properties_-webkit-text-security
 * If both the :has selector and the -webkit-text-security: disc are supported,
 * we hide this input field in favor of the custom password input field
 **/
globalStyle(
  `${inputFieldFallbackWrapperStyle}:has(${inputFieldStyle}[type="password"])`,
  {
    "@supports": {
      "(-webkit-text-security: disc)": {
        display: "none",
      },
    },
  },
)
