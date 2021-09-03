import React from 'react';
import { Meta } from '@storybook/react';
import { Story } from '@storybook/react/types-6-0';
import { Container, Spacer } from './storyhelper';
import { CardTitle, Card, H3 } from '../components';
import { P } from '../components';
import { CardProps } from '../components/Card';
import Alert from '../components/Alert';
import AlertContent from '../components/AlertContent';

const meta: Meta = {
  title: 'Card',
  component: Card
};

const Template: Story<CardProps> = (args: CardProps) => (
  <Container>
    <Card {...args} />
  </Container>
);

export const Playground = Template.bind({});

Playground.args = {};

export const NarrowCard = () => (
  <Container>
    <Spacer>
      <Card>
        <CardTitle>Sign in</CardTitle>
        <Alert severity="error">
          <AlertContent>
            The provided credentials are invalid. Check for spelling mistakes in
            your password, username, email address or phone number.
          </AlertContent>
        </Alert>
        <P>Some text</P>
        <Alert severity="info">
          <AlertContent>
            The provided credentials are invalid. Check for spelling mistakes in
            your password, username, email address or phone number.
          </AlertContent>
        </Alert>
      </Card>
    </Spacer>
  </Container>
);

export const WideCard = () => (
  <Container>
    <Spacer>
      <Card wide>
        <CardTitle>Sign in</CardTitle>
        <P>Some text</P>
      </Card>
    </Spacer>
  </Container>
);

export default meta;
