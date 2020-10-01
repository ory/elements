import React, { HTMLAttributes, ReactNode } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import {
  theme,
  typographyBodyStyles,
  typographyCaptionStyles,
  typographyH1Styles,
  typographyH2Styles,
  typographyH3Styles,
  typographyLinkStyles,
  typographyParagraphStyles,
} from '../theme'

const StyledH1 = styled.h1(typographyH1Styles)
const StyledH2 = styled.h2(typographyH2Styles)
const StyledH3 = styled.h3(typographyH3Styles)
const StyledSpan = styled.span(typographyBodyStyles)
const StyledParagraph = styled.span(typographyParagraphStyles)
const StyledCode = styled.span(typographyParagraphStyles)
const StyledCaption = styled.span(typographyCaptionStyles)
const StyledAnchor = styled.a(typographyLinkStyles)

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
}

export interface SpanProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
}

export interface ParagraphProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode
}

export interface CodeProps extends React.HTMLAttributes<CodeProps> {
  children: ReactNode
}

export interface AnchorProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
}

export const H1 = (props: HeadingProps) => (
  <ThemeProvider theme={theme}>
    <StyledH1 {...props} />
  </ThemeProvider>
)

export const H2 = (props: HeadingProps) => (
  <ThemeProvider theme={theme}>
    <StyledH2 {...props} />
  </ThemeProvider>
)

export const H3 = (props: HeadingProps) => (
  <ThemeProvider theme={theme}>
    <StyledH3 {...props} />
  </ThemeProvider>
)

// @jfcurran where is this being used? I think it should be renamed because
// it resembles the `<body>` but I would assume the `<body>` style to equal the
// `<p>` style.
export const Body = (props: SpanProps) => (
  <ThemeProvider theme={theme}>
    <StyledSpan {...props} />
  </ThemeProvider>
)

export const P = (props: ParagraphProps) => (
  <ThemeProvider theme={theme}>
    <StyledParagraph {...props} />
  </ThemeProvider>
)

export const Code = (props: HeadingProps) => (
  <ThemeProvider theme={theme}>
    <StyledCode {...props} />
  </ThemeProvider>
)

export const Caption = (props: SpanProps) => (
  <ThemeProvider theme={theme}>
    <StyledCaption {...props} />
  </ThemeProvider>
)

export const Link = (props: AnchorProps) => (
  <ThemeProvider theme={theme}>
    <StyledAnchor {...props} />
  </ThemeProvider>
)
