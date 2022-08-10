import { oryTheme } from './theme.css';
import { recipe } from '@vanilla-extract/recipes';

export const buttonLinkStyle = recipe({
  base: {
    cursor: 'pointer',
    textDecoration: 'none',
    color: oryTheme.accent.def,
    ':disabled': {
      color: oryTheme.foreground.disabled
    },
    ':hover': {
      color: oryTheme.accent.muted
    },
    ':active': {
      color: oryTheme.accent.emphasis
    },
    ':focus': {
      color: oryTheme.accent.muted
    }
  }
});
