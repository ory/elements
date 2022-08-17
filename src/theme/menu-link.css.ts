import { style } from '@vanilla-extract/css';
import { pxToRem } from '../common';

export const menuLinkStyle = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: pxToRem(10),
  padding: pxToRem(6, 8)
});

export const menuLinkIconLeftStyle = style({
  paddingRight: pxToRem(8)
});
