import { style } from '@vanilla-extract/css';
import { pxToRem } from '../utils';
import { oryTheme } from './theme.css';

export const inputFieldTitleStyle = style({
  color: oryTheme.accent.default
});

export const inputFieldStyle = style({
  all: 'unset',
  boxSizing: 'border-box',
  color: oryTheme.input.text,
  background: oryTheme.input.background,
  border: `1px solid ${oryTheme.border.default}`,
  borderRadius: pxToRem(4),
  padding: pxToRem(12, 24),
  ':hover': {
    border: `1px solid ${oryTheme.accent.muted}`
  },
  ':focus': {
    inset: `4px`,
    borderColor: oryTheme.accent.muted
  },
  ':active': {
    border: `1px solid ${oryTheme.accent.emphasis}`
  },
  ':invalid': {
    border: `1px solid ${oryTheme.error.emphasis}`
  },
  ':disabled': {
    border: `1px solid ${oryTheme.input.disabled}`
  }
});
