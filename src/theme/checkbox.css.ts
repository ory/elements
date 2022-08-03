import { style } from '@vanilla-extract/css';
import { pxToEm, pxToRem } from '../utils';
import { oryTheme } from './theme.css';

export const checkboxStyle = style({
  cursor: 'pointer',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  appearance: 'none',
  height: pxToRem(18),
  width: pxToRem(18),
  border: `${pxToEm(2)} solid ${oryTheme.accent.default}`,
  borderRadius: pxToEm(4),
  color: oryTheme.accent.default,
  selectors: {
    '&:checked::after': {
      fontFamily: '"Font Awesome 5 Free"',
      fontWeight: 400,
      display: 'inline-block',
      fontStyle: 'normal',
      fontVariant: 'normal',
      textRendering: 'auto',
      WebkitFontSmoothing: 'antialiased',
      content: '\\f00c',
      textAlign: 'center',
      color: oryTheme.accent.default
    }
  },
  ':disabled': {
    borderColor: oryTheme.accent.disabled
  }
});
