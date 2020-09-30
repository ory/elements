import React, { ReactChildren, ReactNode } from 'react';

export const Spacer = ({ children }: { children: ReactNode }) => (
  <div style={{
    marginBottom: '20px',
  }}>
    {children}
  </div>
);