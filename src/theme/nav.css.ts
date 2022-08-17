import { style } from '@vanilla-extract/css';
import { pxToRem } from '../common';
import { oryTheme } from './theme.css';

export const navStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: pxToRem(24),
  padding: pxToRem(0, 24, 24),
  backgroundColor: oryTheme.background.canvas,
  width: pxToRem(300)
});

export const navSectionTitleStyle = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: pxToRem(0, 8, 6)
});
