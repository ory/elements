import { ThemeProps as StyledThemeProps } from 'styled-components';

export * from './buttonStyles';
export * from './typographyStyles';
export * from './textInputStyles';
export * from './checkboxStyles';
export * from './codeBoxStyles';

export const theme = {
  grey0: '#F9F9FA',
  grey5: '#F0F0F1',
  grey10: '#E1E1E3',
  grey30: '#B4B4BB',
  grey60: '#5A5B6A',
  grey70: '#4A4B57',
  grey100: '#19191D',

  blue30: '#9DC2FF',
  blue60: '#2979FF',
  blue70: '#2264D1',

  green30: '#A9D3AB',
  green60: '#43A047',
  green70: '#37833B',

  red30: '#FAA9A3',
  red60: '#F44336',
  red70: '#C8372D',

  bluegrey30: '#B4BBE2',
  bluegrey60: '#97A0D6',

  primaryaccent: '#FF80FF',

  primary30: '#F6A8C2',
  primary60: '#EC407A',
  primary70: '#C23564',

  borderRadius: '4px',
  fontFamily: "'Rubik', sans-serif"
};

export type Theme = typeof theme;

export type ThemeProps = StyledThemeProps<Theme>;
