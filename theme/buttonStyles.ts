import { Theme } from './index'

export interface ButtonStyles {
  big?: boolean
}

export const buttonStyles = ({
  big,
  theme,
}: ButtonStyles & { theme: Theme }) => `
font-family: ${theme.fontFamily};
font-style: normal;
font-weight: normal;
font-size: 14px;
line-height: ${!big ? '20px' : '30px'};
color: ${theme.grey0};
border-radius: ${theme.borderRadius};

width: 100%;

padding: 5px 12px;
border: 2px solid transparent;
outline: none;

background-color: ${theme.primary60};

&:disabled {
  color: ${theme.grey30};
  background-color: ${theme.grey10};
}

&.fake-hover,
&:hover {
  background-color: ${theme.primary30};
}

&.fake-focus,
&:focus {
  background-color: ${theme.primary60};
  border: 2px solid ${theme.blue30};
  outline: none;
}

&.fake-click,
&:active {
  background-color: ${theme.primary70};
  outline: none;
  border: 2px solid transparent;
}
`
