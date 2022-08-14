import React from 'react';
import { Story, ComponentMeta } from '@storybook/react';
import { InputField, InputFieldProps } from '../react-components';
import { Container } from './storyhelper';

export default {
  title: 'Component/InputField',
  component: InputField,
  argTypes: {
    theme: {
      options: ['light', 'dark'],
      control: { type: 'radio' }
    }
  }
} as ComponentMeta<typeof InputField>;

export type InputFieldStoryProps = InputFieldProps & {
  theme: 'light' | 'dark';
};

const Template: Story<InputFieldStoryProps> = (args: InputFieldStoryProps) => (
  <Container theme={args.theme || 'light'}>
    <InputField {...args} />
  </Container>
);

export const NormalInputField = Template.bind({});

NormalInputField.args = {
  title: 'Password',
  required: true
};
