import { ThemeProps } from './index';

export interface CardStyles extends ThemeProps {
  wide?: boolean;
}

export const cardStyles = ({ theme, wide }: CardStyles) => `
background: white;
border: 1px solid ${theme.grey10};

display: flex;
flex-direction: column;
align-items: stretch;
width:  ${wide ? '680' : '336'}px;
margin: 0 auto;
padding: 20px;
`;

export const cardTitleStyles = ({ theme }: CardStyles) => `
color: ${theme.primary60};
text-align: center;
margin-bottom: 15px;
`;
