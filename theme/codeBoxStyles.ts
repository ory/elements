import { Theme } from './index';

export const codeBoxStyles = ({
  theme
}: { theme: Theme }) => `
background-color: ${theme.grey70};
padding: 20px;
border-radius: 8px;

& code {
  color: #ECFDFE;
}
`;
