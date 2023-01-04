// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { style } from "@vanilla-extract/css"
import { pxToEm, pxToRem } from "../common"

export const menuLinkStyle = style({
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: pxToRem(10),
  padding: pxToRem(6, 8),
  height: pxToRem(40),
})

export const menuLinkIconLeftStyle = style({
  paddingRight: pxToRem(8),
  width: pxToEm(18),
})

export const menuLinkTextStyle = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: 0,
})
