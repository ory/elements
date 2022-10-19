import { recipe, RecipeVariants } from "@vanilla-extract/recipes"
import { oryTheme } from "./theme.css"

export const messageStyle = recipe({
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
