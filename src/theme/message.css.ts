import { oryTheme } from './theme.css';
import { recipe, RecipeVariants } from '@vanilla-extract/recipes';

export const messageStyle = recipe({
  base: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    color: oryTheme.foreground.def
  },
  variants: {
    severity: {
      error: {
        color: oryTheme.error.emphasis
      },
      success: {
        color: oryTheme.success.emphasis
      },
      disabled: {
        color: oryTheme.foreground.disabled
      }
    }
  }
});

export type MessageStyle = RecipeVariants<typeof messageStyle>;
