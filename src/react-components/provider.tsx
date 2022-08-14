import React from 'react';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { defaultDarkTheme, defaultLightTheme, oryTheme, Theme } from '../theme';

// normalize the standard browser CSS
import '../../public/normalize.css';
// add theme 'Inter' font support
import '../../public/inter-font.css';
import { ThemeProviderProps } from '../component-types';

export const ThemeProvider = ({
  children,
  theme,
  themeOverrides
}: ThemeProviderProps) => (
  <div
    style={assignInlineVars(oryTheme, {
      ...(theme === 'dark' ? defaultDarkTheme : defaultLightTheme),
      ...themeOverrides
    })}
  >
    {children}
  </div>
);
