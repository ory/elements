import React from 'react';
import { Meta } from '@storybook/react';
import { Story } from '@storybook/react/types-6-0';

import { Container, HR } from './storyhelper';
import {
  H1,
  H2,
  H3,
  Code,
  Caption,
  Link as StyledLink,
  P,
  B,
  Lead
} from '../components/Typography';

const meta: Meta = {
  title: 'Typography'
};

const Template: Story<{}> = () => (
  <Container>
    <H1>Heading 1</H1>
    <HR />
    <H2>Heading 2</H2>
    <HR />
    <H3>Heading 3</H3>
    <HR />
    <Lead>Lead Paragraph</Lead>
    <HR />
    <P>Paragraph</P>
    <HR />
    <B>Button</B>
    <HR />
    <Code>{`export const Spacer = ({ children }: { children: ReactNode })`}</Code>
    <HR />
    <Caption>Caption</Caption>
    <HR />
    <StyledLink
      href="https://www.ory.sh/"
      target="_blank"
      rel="noreferrer noopener"
    >
      Link
    </StyledLink>
    <HR />
  </Container>
);

export const Typography = Template.bind({});
Typography.args = {
  children: 'Text'
};

export const Links: Story = () => (
  <Container>
    <StyledLink
      href="https://www.ory.sh/"
      target="_blank"
      rel="noreferrer noopener"
    >
      Regular link
    </StyledLink>
    <HR />
    <StyledLink
      href="https://www.ory.sh/"
      target="_blank"
      rel="noreferrer noopener"
      className="fake-visited"
    >
      Visited link
    </StyledLink>
    <HR />
    <StyledLink
      href="https://www.ory.sh/"
      target="_blank"
      rel="noreferrer noopener"
      className="fake-hover"
    >
      Hover link
    </StyledLink>
    <HR />
    <StyledLink
      href="https://www.ory.sh/"
      target="_blank"
      rel="noreferrer noopener"
      className="fake-active"
    >
      Active link
    </StyledLink>
  </Container>
);

export default meta;
