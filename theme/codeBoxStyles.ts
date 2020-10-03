import { ThemeProps } from './index';

export const codeBoxStyles = ({ theme }: ThemeProps) => `
background-color: ${theme.grey70};
padding: 20px;
border-radius: 8px;

& code {
  color: #ECFDFE;
}
`;
