import { ThemeProps } from '../index';

export const typographyH1Styles = () => `
font-style: normal;
font-weight: 500;
font-size: 32px;
line-height: 40px;
`;

export const typographyH2Styles = () => `
font-style: normal;
font-weight: normal;
font-size: 16px;
line-height: 24px;
`;

export const typographyH3Styles = () => `
font-style: normal;
font-weight: normal;
font-size: 14px;
line-height: 20px;
`;

export const typographyLeadStyles = () => `
font-style: normal;
font-weight: 300;
font-size: 16px;
line-height: 24px;
`;

export const typographyParagraphStyles = () => `
font-style: normal;
font-weight: 300;
font-size: 14px;
line-height: 20px;
`;

export const typographyButtonStyles = () => `
font-style: normal;
font-weight: 300;
font-size: 14px;
line-height: 20px;
`;

export const typographyCodeStyles = ({ theme }: ThemeProps) => `
font-style: normal;
font-weight: normal;
font-size: 14px;
line-height: 20px;

color: ${theme.grey70}
`;

export const typographyCaptionStyles = () => `
font-style: normal;
font-weight: 300;
font-size: 12px;
line-height: 18px;
`;

export const typographyLinkStyles = ({ theme }: ThemeProps) => `
font-style: normal;
font-weight: 300;
font-size: 12px;
line-height: 18px;

text-decoration: none;
color: ${theme.primary60};

&.fake-visited, 
&:visited {
  color: ${theme.primary70};
}

&.fake-hover,
&:hover {
  color: ${theme.primary30};
}
&.fake-active, 
&:active {
  color: ${theme.primary70};
}
`;
