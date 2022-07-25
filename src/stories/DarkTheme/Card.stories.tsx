import React from 'react';
import {Meta} from '@storybook/react';
import {Story} from '@storybook/react/types-6-0';
import {Container, Spacer} from '../storyhelper';
import {Message} from "../../components/message";
import {Card, CardProps} from "../../components";

const meta: Meta = {
  title: 'DarkTheme/Card',
  component: Card
};

const Template: Story<CardProps> = (args: CardProps) => (
  <Container theme={'dark'}>
    <Card {...args} />
  </Container>
);

export const Playground = Template.bind({});

Playground.args = {
  title: 'Normal Title',
  children: <Message severity="error" message="This is an error message."/>
};

export default meta;
