import { recipe, RecipeVariants } from '@vanilla-extract/recipes';
import { pxToRem } from '../utils';

export const gridStyle = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: pxToRem(16)
  },
  variants: {
    direction: {
      row: {
        flexDirection: 'row'
      },
      column: {
        flexDirection: 'column'
      }
    },
    gap: {
      8: {
        gap: pxToRem(8)
      },
      16: {
        gap: pxToRem(16)
      },
      32: {
        gap: pxToRem(32)
      },
      64: {
        gap: pxToRem(64)
      }
    }
  }
});

// Get the type
export type GridStyle = RecipeVariants<typeof gridStyle>;
