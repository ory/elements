// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { style } from "@vanilla-extract/css"
import { pxToRem } from "../common"
import { oryTheme } from "./theme.css"

export const identifierStyle = style({
  display: "flex",
  flexFlow: "column",
  alignItems: "center",
  margin: "1rem",
  marginBottom: 0,
  padding: "0.5rem",
})

export const identifierNameStyle = style({
  padding: "0.5rem 1rem",
  fontWeight: "bold",
  marginTop: "0.5rem",
  border: `1px solid ${oryTheme.border.def}`,
  borderRadius: pxToRem(4),
  color: oryTheme.foreground.muted,
})
