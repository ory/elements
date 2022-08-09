import { style } from '@vanilla-extract/css';
import { pxToRem } from '../utils';
import { oryTheme } from './theme.css';

export const checkboxStyle = style({
  display: 'flex',
  justifyContent: 'start',
  cursor: 'pointer',
  gap: pxToRem(8)
});

export const checkboxLabelStyle = style({});

export const checkboxInputStyle = style({
  cursor: 'pointer',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  appearance: 'none',
  minWidth: pxToRem(18),
  minHeight: pxToRem(18),
  maxHeight: pxToRem(18),
  maxWidth: pxToRem(18),
  border: `2px solid ${oryTheme.accent.default}`,
  borderRadius: pxToRem(4),
  margin: pxToRem(3),
  color: oryTheme.accent.default,
  selectors: {
    '&:checked::before': {
      fontFamily: "'Font Awesome 6 Free'", // this is required for the fontawesome icon to work
      fontSize: pxToRem(10),
      display: 'block',
      textAlign: 'center',
      position: 'relative',
      content: '\\f00c', // this is a fontawesome unicode character to switch back to a basic html checkmark use \\2713
      color: oryTheme.accent.default,
      top: pxToRem(2.5)
    }
  },
  ':disabled': {
    borderColor: oryTheme.accent.disabled
  }
});
