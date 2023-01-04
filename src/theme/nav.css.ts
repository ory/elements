// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { globalStyle, style } from "@vanilla-extract/css"
import { pxToRem } from "../common"
import { defaultBreakpoints } from "./consts"
import { oryTheme } from "./theme.css"

export const navStyle = style({
  // disable text highlight inside the nav
  WebkitTouchCallout: "none",
  WebkitUserSelect: "none",
  KhtmlUserSelect: "none",
  MozUserSelect: "none",
  msUserSelect: "none",
  userSelect: "none",
  borderRight: `1px solid ${oryTheme.border.def}`,
  zIndex: 3,
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  gap: pxToRem(24),
  padding: pxToRem(0, 24, 24),
  backgroundColor: oryTheme.background.canvas,
  "@media": {
    [`screen and (max-width: ${defaultBreakpoints.md})`]: {
      display: "block",
      justifyContent: "space-between",
      width: "100%",
      top: 0,
      padding: pxToRem(32, 24, 24),
      position: "absolute",
    },
    [`screen and (min-width: ${defaultBreakpoints.md})`]: {
      height: "100%",
      width: pxToRem(300),
    },
  },
})

// each section has a title and under it links
export const navSectionTitleStyle = style({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: pxToRem(0, 8, 6),
})

// this is our ul element containing all of the nav links
export const navMenuSectionStyle = style({
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  listStyleType: "none",
  padding: 0,
  flex: 1,
})

export const navMenuLinkSelectedStyle = style({
  backgroundColor: oryTheme.background.subtle,
  borderRadius: pxToRem(4),
})

export const navMainSectionStyle = style({
  "@media": {
    [`screen and (max-width: ${defaultBreakpoints.md})`]: {
      minHeight: "calc(100vh - 120px)",
    },
  },
})

// hide the nav elements when the nav is collapsed
globalStyle(`${navStyle} input:not(:checked) ~ ${navMenuSectionStyle}`, {
  "@media": {
    [`screen and (max-width: ${defaultBreakpoints.md})`]: {
      display: "none",
    },
  },
})

// show the elements when the nav checkbox is checked
globalStyle(`${navStyle} input:checked ~ ${navMenuSectionStyle}`, {
  "@media": {
    [`screen and (max-width: ${defaultBreakpoints.md})`]: {
      display: "flex",
      height: "auto",
    },
  },
})

// just dont ever show the input checkbox
globalStyle(`${navStyle} > input`, {
  display: "none",
})

// the label of the checkbox shouldn't be visible on desktop, but should be there on mobile
globalStyle(`${navStyle} > ${navSectionTitleStyle} label`, {
  cursor: "pointer",
  "@media": {
    [`screen and (min-width: ${defaultBreakpoints.md})`]: {
      display: "none",
    },
  },
})

// manage our icons
// show the menu icon when it is unchecked and exit icon when it is checked
globalStyle(
  `${navStyle} input:checked ~ ${navSectionTitleStyle} label i:first-child`,
  {
    display: "none",
  },
)

globalStyle(
  `${navStyle} input:not(:checked) ~ ${navSectionTitleStyle} label i:last-child`,
  {
    display: "none",
  },
)

// push the menu to the bottom of the nav
export const navSectionBottom = style({
  marginTop: "auto",
})
