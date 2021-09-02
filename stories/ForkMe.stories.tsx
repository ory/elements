import React from 'react';
import { Meta } from '@storybook/react';
import { Story } from '@storybook/react/types-6-0';
import { Container, Spacer } from './storyhelper';
import CodeBox, { CodeBoxProps } from '../src/components/CodeBox';
import ForkMe, { ForkMeProps } from '../src/components/ForkMe';

const meta: Meta = {
  title: 'Fork Me',
  component: ForkMe
};

const Template: Story<ForkMeProps> = (args) => (
  <Container width={400}>
    <ForkMe {...args} />
  </Container>
);

export const Playground = Template.bind({});
Playground.args = {};

export default meta;
