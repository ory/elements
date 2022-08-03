import React from 'react';
import { Story } from '@storybook/react/types-6-0';
import { Container } from './storyhelper';
import { Message } from "../react";
import { Card, CardProps } from "../react";
import { ComponentMeta } from '@storybook/react';

export default {
  title: 'Component/Card',
  component: Card,
  argTypes: {
    theme: {
      options: ['light', 'dark'],
      control: { type: 'radio' }
    }
  }
} as ComponentMeta<typeof Card>;

const Template: Story<CardProps> = (args: CardProps) => (
  <Container theme={'light'}>
    <Card {...args} />
  </Container>
);

export const NormalCard = Template.bind({});

NormalCard.args = {
  title: 'Normal Title',
  children: <Message severity="error" message="This is an error message." />
};