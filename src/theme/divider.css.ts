import { oryTheme } from './theme.css';
import { pxToRem } from '../utils';
import { recipe } from '@vanilla-extract/recipes';

export const dividerStyle = recipe({
  base: {
    display: 'block',
    textAlign: 'center',
    overflow: 'hidden',
    boxSizing: 'border-box',
    border: `${pxToRem(4)} solid`,
    borderColor: oryTheme.border.default,
    width: pxToRem(64)
  }
});
