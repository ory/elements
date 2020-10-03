import {
  ThemeProps,
  typographyCaptionStyles,
  typographyH3Styles,
  typographyParagraphStyles
} from './index';

export interface TextInputStyles extends ThemeProps {
  help?: boolean;
}

export const textInputStyles = ({ help, theme }: TextInputStyles) => `
& .text-input-title {
  ${typographyH3Styles({ theme })}
}

& .text-input-subtitle {
  ${typographyCaptionStyles({ theme })}
}
                             
& .text-input {
  ${typographyParagraphStyles({ theme })}
  
  color: ${theme.grey70}; 
  border-radius: ${theme.borderRadius};
  width: 100%;
  padding: 5px 12px;
  
  margin-top: 7px;
  margin-bottom: ${!help ? '15px' : '7px'};
  border: 1px solid ${theme.grey10};
  outline: none;
  
  background-color: ${theme.grey0};
}

&.fake-hover .text-input,
& .text-input:hover {
  border: 1px solid ${theme.primary30};
}

&.fake-focus .text-input,
& .text-input:focus {
  border: 1px solid ${theme.primary60};
}

& .text-input:disabled, 
&:hover:disabled {
  color: ${theme.grey30};
  background-color: ${theme.grey10};
  border: 1px solid transparent;
}

&.state-success .text-input {
  border: 1px solid ${theme.green60};
}

&.state-success .text-input-title, 
&.state-success .text-input-subtitle {
  color: ${theme.green60};
}

&.state-error .text-input {
  border: 1px solid ${theme.red60};
}

&.state-error .text-input-title, 
&.state-error .text-input-subtitle {
  color: ${theme.red60};
}
`;
