// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { oryTheme } from "./theme.css"
import { recipe, RecipeVariants } from "@vanilla-extract/recipes"

const SeverityTypes = [
  "error",
  "success",
  "info",
  "disabled",
  "default",
] as const

export type Severity = (typeof SeverityTypes)[number]

type MessageVariants = {
  textPosition: Record<string, any>
  severity: Record<Severity, any>
}

export const messageStyle = recipe<MessageVariants>({
  base: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  defaultVariants: { textPosition: "center", severity: "default" },
  variants: {
    textPosition: {
      start: {
        justifyContent: "flex-start",
      },
      center: {
        justifyContent: "center",
      },
      end: {
        justifyContent: "flex-end",
      },
    },
    severity: {
      error: {
        color: oryTheme.error.emphasis,
      },
      success: {
        color: oryTheme.success.emphasis,
      },
      info: {
        color: oryTheme.foreground.def,
      },
      disabled: {
        color: oryTheme.foreground.disabled,
      },
      default: {
        color: oryTheme.foreground.def,
      },
    },
  },
})

export type MessageStyle = RecipeVariants<typeof messageStyle>
