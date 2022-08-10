import { oryTheme } from './theme.css';
import { pxToRem } from '../utils';
import { recipe, RecipeVariants } from '@vanilla-extract/recipes';

export const dividerStyle = recipe({
  base: {
    display: 'block',
    textAlign: 'center',
    overflow: 'hidden',
    boxSizing: 'border-box',
    border: 0,
    borderTop: `${pxToRem(4)} solid`,
    borderColor: oryTheme.border.def,
    width: pxToRem(64)
  },
  variants: {
    sizes: {
      fullWidth: {
        width: '100%'
      }
    }
  }
});

// Get the type
export type DividerStyle = RecipeVariants<typeof dividerStyle>;
