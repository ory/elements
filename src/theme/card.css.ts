import {recipe, RecipeVariants} from '@vanilla-extract/recipes';
import {pxToRem} from "../utils";
import {lightTheme} from "./theme.css";

export const cardStyle = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    // @ts-ignore
    background: lightTheme.background.surface,
    // @ts-ignore
    color: lightTheme.foreground.default,
    width: '100%',
    padding: pxToRem(48),
    borderRadius: pxToRem(16),
    border: `${pxToRem(1)} solid ${lightTheme.border.default}`,
  },
  variants: {
    size: {
      wide: {
        width: pxToRem(432),
      }
    }
  }
})

export type CardVariants = RecipeVariants<typeof cardStyle>;
