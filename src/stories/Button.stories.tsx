import React from 'react';
import { Meta } from '@storybook/react';
import { Story } from '@storybook/react/types-6-0';

import Button, { ButtonProps } from '../components/Button';
import { Container, Spacer } from './storyhelper';
import { Caption, Link as StyledLink } from '../components/Typography';

const meta: Meta = {
  title: 'Button',
  component: Button
};

const Template: Story<ButtonProps> = (args: ButtonProps) => (
  <Container>
    <Button {...args} />
  </Container>
);

export const Playground = Template.bind({});
Playground.args = {
  children: 'Default Text'
};

export const Size = () => (
  <Container>
    <Spacer>
      <Button>Regular</Button>
    </Spacer>
    <Spacer>
      <Button big>Big</Button>
    </Spacer>
  </Container>
);

export const Hover = () => (
  <Container>
    <Spacer>
      <Button className="fake-hover">Hover</Button>
    </Spacer>
    <Spacer>
      <Button big className="fake-hover">
        Hover
      </Button>
    </Spacer>
  </Container>
);

export const Click = () => (
  <Container>
    <Spacer>
      <Button className="fake-click">Click</Button>
    </Spacer>
    <Spacer>
      <Button big className="fake-click">
        Click
      </Button>
    </Spacer>
  </Container>
);

export const Focus = () => (
  <Container>
    <Spacer>
      <Button className="fake-focus">Focus</Button>
    </Spacer>
    <Spacer>
      <Button big className="fake-focus">
        Focus
      </Button>
    </Spacer>
  </Container>
);

export const Disabled = () => (
  <Container>
    <Spacer>
      <Button disabled={true}>Disabled</Button>
    </Spacer>
    <Spacer>
      <Button big disabled={true}>
        Disabled
      </Button>
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
        <Button helper={message}>Helper</Button>
      </Spacer>
      <Spacer>
        <Button big helper={message}>
          Helper
        </Button>
      </Spacer>
    </Container>
  );
};

export default meta;
