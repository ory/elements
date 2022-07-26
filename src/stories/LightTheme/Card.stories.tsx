import React from 'react';
import {Meta} from '@storybook/react';
import {Story} from '@storybook/react/types-6-0';
import {Container} from '../storyhelper';
import {Message} from "../../react";
import {Card, CardProps} from "../../react";

const meta: Meta = {
  title: 'LightTheme/Card',
  component: Card
};

const Template: Story<CardProps> = (args: CardProps) => (
  <Container theme={'light'}>
    <Card {...args} />
  </Container>
);

export const Playground = Template.bind({});

Playground.args = {
  title: 'Normal Title',
  children: <Message severity="error" message="This is an error message."/>
};

export default meta;
