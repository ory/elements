import { pxToRem } from '../utils';

export type Font = {
  fontFamily: string;
  fontStyle: string;
};

export type BreakPoints = {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xl2: string;
};

export const defaultBreakpoints: BreakPoints = {
  sm: pxToRem(640),
  md: pxToRem(768),
  lg: pxToRem(1024),
  xl: pxToRem(1280),
  xl2: pxToRem(1536)
};

export type Theme = {
  accent: {
    default: string;
    muted: string;
    emphasis: string;
    disabled: string;
    subtle: string;
  };
  foreground: {
    default: string;
    muted: string;
    subtle: string;
    disabled: string;
    onDark: string;
    onAccent: string;
    onDisabled: string;
  };
  background: {
    surface: string;
    canvas: string;
  };
  error: {
    default: string;
    subtle: string;
    muted: string;
    emphasis: string;
  };
  success: {
    emphasis: string;
  };
  border: {
    default: string;
  };
  text: {
    default: string;
    disabled: string;
  };
  input: {
    background: string;
    disabled: string;
    placeholder: string;
    text: string;
  };
} & Font;

export const defaultFont = {
  fontFamily: 'Inter',
  fontStyle: 'normal'
};

const defaultButtonFontTheme = {
  fontFamily: 'Inter',
  textDecoration: 'none',
  fontSize: pxToRem(16),
  lineHeight: pxToRem(28)
};

export const defaultLightTheme: Theme = {
  ...defaultFont,
  accent: {
    default: '#3D53F5',
    muted: '#6475F7',
    emphasis: '#3142C4',
    disabled: '#E0E0E0',
    subtle: '#eceefe'
  },
  foreground: {
    default: '#171717',
    muted: '#616161',
    subtle: '#9E9E9E',
    disabled: '#BDBDBD',
    onDark: '#FFFFFF',
    onAccent: '#FFFFFF',
    onDisabled: '#e0e0e0'
  },
  background: {
    surface: '#FFFFFF',
    canvas: '#FCFCFC'
  },
  error: {
    default: '#9c0f2e',
    subtle: '#fce8ec',
    muted: '#e95c7b',
    emphasis: '#DF1642'
  },
  success: {
    emphasis: '#18A957'
  },
  border: {
    default: '#E0E0E0'
  },
  text: {
    default: '#FFFFFF',
    disabled: '#757575'
  },
  input: {
    background: '#FFFFFF',
    disabled: '#E0E0E0',
    placeholder: '#9E9E9E',
    text: '#424242'
  }
};

export const defaultDarkTheme: Theme = {
  ...defaultFont,
  accent: {
    default: '#6475f7',
    disabled: '#757575',
    muted: '#3142c4',
    emphasis: '#3d53f5',
    subtle: '#0c1131'
  },
  foreground: {
    default: '#FFFFFF',
    muted: '#ddd9f7',
    subtle: '#9a8ce8',
    onDark: '#FFFFFF',
    onAccent: '#FFFFFF',
    onDisabled: '#e0e0e0',
    disabled: '#bdbdbd'
  },
  background: {
    surface: '#110d2b',
    canvas: '#090616'
  },
  border: {
    default: '#221956'
  },
  error: {
    default: '#e95c7b',
    subtle: '#2d040d',
    muted: '#9c0f2e',
    emphasis: '#df1642'
  },
  success: {
    emphasis: '#18a957'
  },
  input: {
    background: '#FFFFFF',
    text: '#424242',
    placeholder: '#9e9e9e',
    disabled: '#eeeeee'
  },
  text: {
    default: '#FFFFFF',
    disabled: '#757575'
  }
};
