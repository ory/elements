import {
  ThemeProps,
  typographyH3Styles,
  typographyLinkStyles,
  wrapCss
} from './index';

export const forkMeStylesText = (props: ThemeProps) => `
  ${typographyH3Styles(props)}
  color: ${props.theme.grey0};
  display: flex;  
`;

export const cssForkMeStylesText = (props: ThemeProps) =>
  wrapCss('fork-me-text', forkMeStylesText(props));

export const forkMeStylesImages = () => `
  padding: 9px;
  height: 18px;
  width: 38px;
`;

export const cssForkMeStylesImages = (props: ThemeProps) =>
  wrapCss('fork-me-image', forkMeStylesImages());

export const forkMeStylesFork = () => `
  height: 14px;
  width: 14px;
`;

export const cssForkMeStylesFork = (props: ThemeProps) =>
  wrapCss('fork-me-fork', forkMeStylesFork());

export const forkMeStylesLink = (props: ThemeProps) => {
  let css = `
  ${typographyLinkStyles(props)}
  
  font-size: 14px;
  line-height: 20px;
  color: ${props.theme.grey0};
  font-family: ${props.theme.regularFont500};
  font-weight: 500;
  
  flex-wrap: nowrap;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
`;

  if (props.theme.platform !== 'react-native') {
    css += `
  &.fake-visited, 
  &:visited {
    color: ${props.theme.grey0};
  }
  
  &.fake-hover,
  &:hover {
    color: ${props.theme.grey30};
  }
  &.fake-active, 
  &:active {
    color: ${props.theme.grey30};
  }
`;
  }

  return css;
};

export const cssForkMeStylesLink = (props: ThemeProps) =>
  wrapCss('fork-me-link', forkMeStylesLink(props));

export const forkMeStyles = ({ theme }: ThemeProps) => {
  let css = `
  background-color: ${theme.primary60};
  padding: 8px 32px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`;
  if (theme.platform === 'react') {
    css += `box-sizing: border-box;
`;
  }
  return css;
};

export const cssForkMeStyles = (props: ThemeProps) =>
  wrapCss('fork-me', forkMeStyles(props));
