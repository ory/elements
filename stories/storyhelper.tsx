import React, { ReactNode } from 'react';
import { GlobalStyle } from '../theme/globalStyles';
import { ThemeProvider } from 'styled-components';
import { theme } from '../theme';

export const Spacer = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      marginBottom: '20px'
    }}
  >
    {children}
  </div>
);

export const Container = ({
  children,
  width = 260
}: {
  children: ReactNode;
  width?: number;
}) => (
  <div style={{ width, margin: '0 auto' }}>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  </div>
);

export const HR = () => (
  <hr
    style={{
      border: 'none',
      outline: 'none',
      background: '#bbb',
      height: '1px',
      margin: '16px 0'
    }}
  />
);
