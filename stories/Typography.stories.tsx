import React, { ReactNode } from 'react'
import { Meta } from '@storybook/react'
import { Story } from '@storybook/react/types-6-0'

import { ButtonProps } from './Button'
import { Container, HR } from './storyhelper'
import { H1, H2, H3, Code, Caption, Link as StyledLink, P } from './Typography'

const meta: Meta = {
  title: 'Typography',
}

const Template: Story<ButtonProps> = () => (
  <Container>
    <H1>Heading 1</H1>
    <HR />
    <H2>Heading 2</H2>
    <HR />
    <H3>Heading 3</H3>
    <HR />
    <P>Paragraph</P>
    <HR />
    <Code>{`export const Spacer = ({ children }: { children: ReactNode })`}</Code>
    <HR />
    <Caption>Caption</Caption>
    <HR />
    <StyledLink href="https://www.ory.sh/">Link</StyledLink>
    <HR />
  </Container>
)

const randomUrl = Math.random()
  .toString(36)
  .replace(/[^a-z]+/g, '')

export const Link: Story = () => (
  <Container>
    <StyledLink href={randomUrl}>Regular link</StyledLink>
    <HR />
    <StyledLink href="https://www.ory.sh/" className="fake-visited">
      Visited link
    </StyledLink>
    <HR />
    <StyledLink href={randomUrl} className="fake-hover">
      Hover link
    </StyledLink>
    <HR />
    <StyledLink href={randomUrl} className="fake-active">
      Active link
    </StyledLink>
  </Container>
)

export const Playground = Template.bind({})
Playground.args = {}

export default meta
