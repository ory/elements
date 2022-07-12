import { ThemeProps } from './index';

export interface CardStyles extends ThemeProps {
  wide?: boolean;
}

export const cardStyles = ({ theme, wide }: CardStyles) => `
background: white;
border: 1px solid ${theme.palettes.light.border.def};
border-radius: ${theme.cards.borderRadius};

color: ${theme.palettes.light.text.def};

display: flex;
flex-direction: column;
align-items: stretch;
minWidth:  ${wide ? '432px' : '100%'};
margin: 0 auto;
padding: 48px;
`;

export const cardTitleStyles = ({ theme }: CardStyles) => `
color: ${theme.palettes.light.text.def};
text-align: center;
margin-bottom: 15px;
`;
