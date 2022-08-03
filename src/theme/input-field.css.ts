import { style } from '@vanilla-extract/css';
import { pxToRem } from '../utils';
import { oryTheme } from './theme.css';

export const inputFieldStyle = style({
  border: `1px solid ${oryTheme.border.default}`,
  borderRadius: pxToRem(4)
});
