import {oryTheme} from "./theme.css";
import {recipe, RecipeVariants} from "@vanilla-extract/recipes";

export const messageStyle = recipe({
  base: {
    color: oryTheme.success.emphasis
  },
  variants: {
    severity: {
      error: {
        color: oryTheme.error.emphasis
      },
      success: {
        color: oryTheme.success.emphasis
      },
      info: {
        color: oryTheme.text.default
      }
    }
  },
  defaultVariants: {
    severity: 'info'
  }
}, "messageStyle")

export type MessageVariants = RecipeVariants<typeof messageStyle>;
