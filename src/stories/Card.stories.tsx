import React from 'react';
import {Meta} from '@storybook/react';
import {Story} from '@storybook/react/types-6-0';
import {Container, Spacer} from './storyhelper';
import {Message} from "../components/message";
import {Card, CardProps} from "../components/";

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
      <Card title={"Sign in"}>
        <Message severity="error"
                 message={`The provided credentials are invalid. Check for spelling mistakes in your password, username, email address or phone number.`}/>
        <Message severity="info"
                 message={`The provided credentials are invalid. Check for spelling mistakes in your password, username, email address or phone number.`}/>
      </Card>
    </Spacer>
  </Container>
);

export default meta;
