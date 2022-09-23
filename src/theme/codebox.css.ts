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

globalStyle(`${codeboxStyle} input:checked ~ ${codeboxContentStyle}`, {
  display: "none",
})
