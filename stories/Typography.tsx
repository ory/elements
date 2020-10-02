import React, { HTMLAttributes, ReactNode } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import {
  theme,
  typographyH1Styles,
  typographyH2Styles,
  typographyH3Styles,
  typographyLeadStyles,
  typographyParagraphStyles,
  typographyButtonStyles,
  typographyCodeStyles,
  typographyCaptionStyles,
  typographyLinkStyles
} from '../theme';

const StyledH1 = styled.h1(typographyH1Styles);
const StyledH2 = styled.h2(typographyH2Styles);
const StyledH3 = styled.h3(typographyH3Styles);
const StyledLead = styled.span(typographyLeadStyles);
const StyledParagraph = styled.p(typographyParagraphStyles);
const StyledButtonTypography = styled.span(typographyButtonStyles);
const StyledCode = styled.code(typographyCodeStyles);
const StyledCaption = styled.span(typographyCaptionStyles);
const StyledAnchor = styled.a(typographyLinkStyles);

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export interface SpanProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export interface ParagraphProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export interface AnchorProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
}

export const H1 = (props: HeadingProps) => <StyledH1 {...props} />;

export const H2 = (props: HeadingProps) => <StyledH2 {...props} />;

export const H3 = (props: HeadingProps) => <StyledH3 {...props} />;

export const Lead = (props: SpanProps) => <StyledLead {...props} />;

export const P = (props: ParagraphProps) => <StyledParagraph {...props} />;

export const B = (props: SpanProps) => <StyledButtonTypography {...props} />;

export const Code = (props: CodeProps) => <StyledCode {...props} />;

export const Caption = (props: SpanProps) => <StyledCaption {...props} />;

export const Link = (props: AnchorProps) => <StyledAnchor {...props} />;
