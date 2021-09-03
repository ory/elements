import { ThemeProps, wrapCss } from './index';

export const codeBoxStyles = ({ theme }: ThemeProps) => `
background-color: ${theme.grey70};
padding: 20px;
border-radius: 8px;
color: #ECFDFE;
overflow-wrap: break-word;
`;

export const cssCodeBoxStyles = (props: ThemeProps) =>
  wrapCss('code-box', codeBoxStyles(props));
