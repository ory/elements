import React, { ReactNode } from 'react';
import { ThemeProvider } from '../react-components';

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
  width = 260,
  theme = 'light'
}: {
  children: ReactNode;
  width?: number;
  theme: 'light' | 'dark';
}) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;

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
