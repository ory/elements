import {recipe, RecipeVariants} from '@vanilla-extract/recipes';
import {pxToRem} from "../utils";
import {backgroundSurfaceColor, foregroundDefaultColor} from "./theme.css";
import {style} from "@vanilla-extract/css";

export const card = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    // @ts-ignore
    background: backgroundSurfaceColor,
    // @ts-ignore
    color: foregroundDefaultColor,
    width: '100%',
    padding: pxToRem(48),
  },
  variants: {
    size: {
      wide: {
        width: pxToRem(432),
      }
    }
  }
})

export type CardVariants = RecipeVariants<typeof card>;
