import React from 'react';
import { Story, ComponentMeta } from '@storybook/react';
import { Divider, DividerProps } from '../react/divider';
import { Container } from './storyhelper';

export default {
  title: 'Component/Divider',
  component: Divider,
  argTypes: {
    theme: {
      options: ['light', 'dark'],
      control: { type: 'radio' }
    }
  }
} as ComponentMeta<typeof Divider>;

type DividerStoryProps = {
  theme: 'light' | 'dark';
  args;
} & DividerProps;

const Template: Story<DividerStoryProps> = (args: DividerStoryProps) => (
  <Container theme={args.theme || 'light'}>
    <Divider {...args} />
  </Container>
);

export const DefaultDivider = Template.bind({});

export const FullWidthDivider = Template.bind({});

FullWidthDivider.args = {
  fullWidth: true
};
