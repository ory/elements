import React from 'react';
import { Meta } from '@storybook/react';
import { Story } from '@storybook/react/types-6-0';

import { Container } from './storyhelper';
import TextInput, { TextInputProps } from '../components/TextInput';

const meta: Meta = {
  title: 'TextInput',
  component: TextInput
};

const Template: Story<TextInputProps> = (args) => (
  <Container>
    <TextInput {...args} />
  </Container>
);

export const Playground = Template.bind({});
Playground.args = {
  value: 'Default Text'
};

export const Default = () => (
  <Container>
    <TextInput title="Default Input" value="Default" />
    <TextInput title="Default Input" value="Default" />
  </Container>
);

export const Hover = () => (
  <Container>
    <TextInput title="Focus Input" value="Focus" className="fake-hover" />
    <TextInput title="Focus Input" value="Focus" className="fake-hover" />
  </Container>
);

export const Focus = () => (
  <Container>
    <TextInput title="Focus Input" value="Focus" className="fake-focus" />
    <TextInput title="Focus Input" value="Focus" className="fake-focus" />
  </Container>
);

export const Error = () => (
  <Container>
    <TextInput title="Error Input" value="Error" state="error" />
    <TextInput title="Error Input" value="Error" state="error" />
  </Container>
);

export const Success = () => (
  <Container>
    <TextInput title="Success Input" value="Success" state="success" />
    <TextInput title="Success Input" value="Success" state="success" />
  </Container>
);

export const Disabled = () => (
  <Container>
    <TextInput title="Disabled Input" value="Disabled" disabled />
    <TextInput title="Disabled Input" value="Disabled" disabled />
  </Container>
);

export const InputWithSubtitle = () => (
  <Container>
    <TextInput
      help
      title="Input with subtitle"
      value="Input"
      subtitle="A good password has at least 15 characters."
    />
    <TextInput
      help
      title="Input with subtitle"
      value="Input"
      subtitle="A good password has at least 15 characters."
    />
  </Container>
);

export const InputWithSubtitleAndState = () => (
  <Container>
    <TextInput
      help
      title="Input with subtitle and state"
      value="Error input"
      subtitle="A good password has at least 15 characters."
      state="error"
    />
    <TextInput
      help
      title="Input with subtitle and state"
      value="Error input"
      subtitle="A good password has at least 15 characters."
      state="error"
    />
  </Container>
);

export default meta;
