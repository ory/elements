import { errorEmphasisColor, successEmphasisColor, textDefaultColor, theme} from "./theme.css";
import {recipe, RecipeVariants} from "@vanilla-extract/recipes";

export const messageStyle = recipe({
  base: {
    color: successEmphasisColor
  },
  variants: {
    severity: {
      error: {
        color: errorEmphasisColor
      },
      success: {
        color: successEmphasisColor
      },
      info: {
        color: textDefaultColor
      }
    }
  },
  defaultVariants: {
    severity: 'info'
  }
}, "messageStyle")

export type MessageVariants = RecipeVariants<typeof messageStyle>;
