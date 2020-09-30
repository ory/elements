import React, { ReactNode } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { buttonStyles, ButtonStyles, theme } from '../theme';

const StyledButton = styled.input(buttonStyles);

export interface ButtonProps extends React.InputHTMLAttributes<HTMLInputElement>, ButtonStyles {
  helper?: ReactNode
  children: string
}

const ButtonOuter = ({ helper, children, ...props }: ButtonProps) => (
  <>
    <form>
      <StyledButton type="button" className="button" {...props} value={children} />
    </form>
    {
      helper && (
        <span className="button-helper">
          {helper}
        </span>
      )
    }
  </>
);

const ThemedButton = (props: ButtonProps) => (
  <ThemeProvider theme={theme}>
    <ButtonOuter {...props} />
  </ThemeProvider>
);

export default ThemedButton;
