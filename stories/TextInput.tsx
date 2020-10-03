import React, { ReactNode } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { textInputStyles, TextInputStyles, theme } from '../theme';

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    TextInputStyles {
  subtitle?: ReactNode;
  helper?: ReactNode;
  state?: 'success' | 'error';
}

const TextInput = ({
  className,
  title,
  subtitle,
  state,
  ...props
}: TextInputProps) => (
  <div className={`${className} ${state ? `state-${state}` : ''}`}>
    {title && <div className="text-input-title">{title}</div>}
    <input type="text" className="text-input" {...props} />
    {subtitle && <div className="text-input-subtitle">{subtitle}</div>}
  </div>
);

export default styled(TextInput)(textInputStyles);
