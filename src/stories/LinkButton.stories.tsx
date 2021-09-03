import React from 'react';
import { Meta } from '@storybook/react';
import { Story } from '@storybook/react/types-6-0';

import LinkButton, { LinkButtonProps } from '../components/LinkButton';
import { Container, Spacer } from './storyhelper';
import { Caption, Link as StyledLink } from '../components/Typography';

const meta: Meta = {
  title: 'LinkButton',
  component: LinkButton
};

const Template: Story<LinkButtonProps> = (args: LinkButtonProps) => (
  <Container>
    <LinkButton {...args} />
  </Container>
);

export const Playground = Template.bind({});
Playground.args = {
  children: 'Default Text'
};

export const Size = () => (
  <Container>
    <Spacer>
      <LinkButton href="#">Regular</LinkButton>
      <LinkButton href="#" big>
        Big
      </LinkButton>
    </Spacer>
  </Container>
);

export const Hover = () => (
  <Container>
    <Spacer>
      <LinkButton href="#" className="fake-hover">
        Hover
      </LinkButton>
    </Spacer>
    <Spacer>
      <LinkButton href="#" big className="fake-hover">
        Hover
      </LinkButton>
    </Spacer>
  </Container>
);

export const Click = () => (
  <Container>
    <Spacer>
      <LinkButton href="#" className="fake-click">
        Click
      </LinkButton>
    </Spacer>
    <Spacer>
      <LinkButton href="#" big className="fake-click">
        Click
      </LinkButton>
    </Spacer>
  </Container>
);

export const Focus = () => (
  <Container>
    <Spacer>
      <LinkButton href="#" className="fake-focus">
        Focus
      </LinkButton>
    </Spacer>
    <Spacer>
      <LinkButton href="#" big className="fake-focus">
        Focus
      </LinkButton>
    </Spacer>
  </Container>
);

export const Disabled = () => (
  <Container>
    <Spacer>
      <LinkButton href="#" disabled={true}>
        Disabled
      </LinkButton>
    </Spacer>
    <Spacer>
      <LinkButton href="#" big disabled={true}>
        Disabled
      </LinkButton>
    </Spacer>
  </Container>
);

export const Helper = () => {
  const message = (
    <Caption>
      By creating an account, you agree to the{' '}
      <StyledLink
        href="https://www.ory.sh/"
        target="_blank"
        rel="noreferrer noopener"
      >
        Terms of Service
      </StyledLink>
      . For more information about privacy practices, see the{' '}
      <StyledLink
        href="https://www.ory.sh/"
        target="_blank"
        rel="noreferrer noopener"
      >
        Privacy Statement
      </StyledLink>
      .
    </Caption>
  );

  return (
    <Container>
      <Spacer>
        <LinkButton helper={message}>Helper</LinkButton>
      </Spacer>
      <Spacer>
        <LinkButton big helper={message}>
          Helper
        </LinkButton>
      </Spacer>
    </Container>
  );
};

export default meta;
