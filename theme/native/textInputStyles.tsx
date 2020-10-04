import { TextInputStyles } from '../index';

export const textInputStyles = ({ theme, help }: TextInputStyles) => `
  color: ${theme.grey70}; 
  border-radius: ${theme.borderRadius};
  width: 100%;
  padding: 5px 12px;
  
  margin-top: 7px;
  margin-bottom: ${!help ? '15px' : '7px'};
  border: 1px solid ${theme.grey10};
`;
