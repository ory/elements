import { pxToRem, ThemeProps, wrapCss } from './index';

export interface CardStyles extends ThemeProps {
  wide?: boolean;
}

export const cardStyles = ({ theme, wide }: CardStyles) => `
background: ${theme.palettes.light.background.surface};
border: 1px solid ${theme.palettes.light.border.def};
border-radius: ${theme.cards.borderRadius};

color: ${theme.palettes.light.foreground.def};

display: flex;
flex-direction: column;
align-items: stretch;
minWidth:  ${wide ? pxToRem(432) : '100%'};
margin: 0 auto;
padding: ${pxToRem(48)};
`;

export const cardTitleStyles = ({ theme }: CardStyles) => `
color: ${theme.palettes.light.foreground.def};
text-align: center;
margin-bottom: 15px;
`;

export const cssCardStyles = (props: CardStyles) =>
  wrapCss('card', cardStyles({ ...props }));
