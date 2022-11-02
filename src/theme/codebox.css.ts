// Copyright © 2022 Ory Corp

import { globalStyle, style } from "@vanilla-extract/css"
import { pxToRem } from "../common"
import { oryTheme } from "./theme.css"

export const codeboxStyle = style({
  boxSizing: "border-box",
  MozBoxSizing: "border-box",
  WebkitBoxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  color: oryTheme.foreground.def,
  border: "1px solid",
  borderColor: oryTheme.border.def,
  backgroundColor: oryTheme.background.surface,
  padding: pxToRem(16, 24, 32),
  borderRadius: pxToRem(8),
  width: "100%",
})

export const codeboxHeaderStyle = style({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  gap: pxToRem(32),
})

export const codeboxContentStyle = style({
  display: "flex",
  width: "100%",
  overflow: "auto",
})

// just dont ever show the input checkbox
globalStyle(`${codeboxStyle} > input`, {
  display: "none",
})

// the label of the checkbox shouldn't be visible on desktop, but should be there on mobile
globalStyle(`${codeboxStyle} > ${codeboxHeaderStyle} label`, {
  cursor: "pointer",
})

// the icon needs to change to carret up when the checkbox is checked
globalStyle(
  `${codeboxStyle} input:checked ~ ${codeboxHeaderStyle} label i:first-child`,
  {
    display: "none",
  },
)

// the icon needs to change to carret down when the checkbox is unchecked
globalStyle(
  `${codeboxStyle} input:not(:checked) ~ ${codeboxHeaderStyle} label i:last-child`,
  {
    display: "none",
  },
)

// don't display the content if the checkbox is checked
globalStyle(`${codeboxStyle} input:checked ~ ${codeboxContentStyle}`, {
  display: "none",
})
