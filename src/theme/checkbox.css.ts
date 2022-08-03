import { style } from '@vanilla-extract/css';
import { pxToEm, pxToRem } from '../utils';
import { oryTheme } from './theme.css';

export const checkboxStyle = style({
  display: 'inline-flex',
  cursor: 'pointer',
  position: 'relative'
});

export const checkboxInputStyle = style({
  cursor: 'pointer',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  appearance: 'none',
  height: pxToRem(18),
  width: pxToRem(18),
  border: `${pxToEm(2)} solid ${oryTheme.accent.default}`,
  borderRadius: pxToRem(4),
  color: oryTheme.accent.default,
  selectors: {
    '&:checked::before': {
      display: 'block',
      textAlign: 'center',
      position: 'absolute',
      content: '\\2713',
      color: oryTheme.accent.default,
      left: pxToRem(3),
      top: pxToRem(1)
    }
  },
  ':disabled': {
    borderColor: oryTheme.accent.disabled
  }
});
