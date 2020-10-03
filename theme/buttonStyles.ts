import { ThemeProps, typographyButtonStyles } from './index';

export interface ButtonStyles extends ThemeProps {
  big?: boolean;
}

export const buttonStyles = ({ big, theme }: ButtonStyles) => `
${typographyButtonStyles({ theme })}

line-height: ${!big ? '20px' : '30px'};
color: ${theme.grey0};
border-radius: ${theme.borderRadius};

width: 100%;

padding: 5px 12px;
margin: 7px 0;
border: 2px solid transparent;
outline: none;

background-color: ${theme.primary60};

&:disabled, &:hover:disabled {
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
`;
