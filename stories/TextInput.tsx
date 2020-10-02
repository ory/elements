import React, { ReactNode } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { textInputStyles, TextInputStyles, theme } from '../theme';

const StyledTextInput = styled.input(textInputStyles);

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    TextInputStyles {
  subtitle?: ReactNode;
  helper?: ReactNode;
  state?: 'success' | 'error';
}

const TextInput = ({ title, subtitle, state, ...props }: TextInputProps) => (
  <div className={state && `state-${state}`}>
    {title && <div className="text-input-title">{title}</div>}
    <StyledTextInput type="text" className="text-input" {...props} />
    {subtitle && <div className="text-input-subtitle">{subtitle}</div>}
  </div>
);

export default TextInput;
