import React, {ReactNode} from 'react';
import '../../dist/style.css';
import {assignInlineVars} from "@vanilla-extract/dynamic";
import '../../dist/style.css';
import {
  defaultDarkTheme, defaultLightTheme,
  oryTheme,
} from "../theme";

export const Spacer = ({children}: { children: ReactNode }) => (
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
}) => (
  <div style={assignInlineVars(oryTheme, {
  ...(theme === 'dark' ? defaultDarkTheme : defaultLightTheme),
  })}>
    {children}
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
