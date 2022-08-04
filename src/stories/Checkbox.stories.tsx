import React from 'react';
import { Story, ComponentMeta } from '@storybook/react';
import { Checkbox, CheckboxProps } from '../react';
import { Container } from './storyhelper';

export default {
  title: 'Component/Checkbox',
  component: Checkbox,
  argTypes: {
    theme: {
      options: ['light', 'dark'],
      control: { type: 'radio' }
    }
  }
} as ComponentMeta<typeof Checkbox>;

export type CheckboxStoryProps = CheckboxProps & {
  theme: 'light' | 'dark';
};

const Template: Story<CheckboxStoryProps> = (args: CheckboxStoryProps) => (
  <Container theme={args.theme || 'light'}>
    <Checkbox {...args} />
  </Container>
);

export const NormalCheckbox = Template.bind({});

NormalCheckbox.args = {};
