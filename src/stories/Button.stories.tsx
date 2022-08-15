import React from 'react';
import { Button } from '../react-components';
import { Container } from './storyhelper';
import { ButtonProps } from '../component-types';
import { ComponentMeta } from '@storybook/react';
import { Story } from '@storybook/react';

export default {
  title: 'Component/Button',
  component: Button,
  argTypes: {
    theme: {
      options: ['light', 'dark'],
      control: { type: 'radio' }
    }
  }
} as ComponentMeta<typeof Button>;

export type ButtonStoryProps = ButtonProps & {
  theme: 'light' | 'dark';
};

const Template: Story<ButtonStoryProps> = (args: ButtonStoryProps) => (
  <Container theme={args.theme || 'light'}>
    <Button {...args} />
  </Container>
);

export const SmallSemibold = Template.bind({});

SmallSemibold.args = {
  title: 'A Small Semibold Button',
  size: 'small',
  variant: 'semibold'
};

export const SmallNormal = Template.bind({});

SmallNormal.args = {
  title: 'A Small Regular Button',
  size: 'small',
  variant: 'regular'
};

export const MediumNormal = Template.bind({});

MediumNormal.args = {
  title: 'A Medium Regular Button',
  size: 'medium',
  variant: 'regular'
};

export const MediumSemibold = Template.bind({});

MediumSemibold.args = {
  title: 'A Medium Semibold Button',
  size: 'medium',
  variant: 'semibold'
};

export const LargeNormal = Template.bind({});

LargeNormal.args = {
  title: 'A Large Regular Button',
  size: 'large',
  variant: 'regular'
};

export const LargeSemibold = Template.bind({});

LargeSemibold.args = {
  title: 'A Large Semibold Button',
  size: 'large',
  variant: 'semibold'
};
