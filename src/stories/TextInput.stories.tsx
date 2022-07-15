import React from 'react';
import { Meta } from '@storybook/react';
import { Story } from '@storybook/react/types-6-0';

import {Container, Spacer} from './storyhelper';
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
    <TextInput title="Default Input" placeholder="Default" />
    <TextInput title="Default Input" placeholder="Default" />
  </Container>
);

export const Hover = () => (
  <Container>
    <TextInput title="Focus Input" placeholder="Hover" className="fake-hover" />
    <TextInput title="Focus Input" placeholder="Hover" className="fake-hover" />
  </Container>
);

export const Focus = () => (
  <Container>
    <TextInput title="Focus Input" placeholder="Focus" className="fake-focus" />
    <TextInput title="Focus Input" placeholder="Focus" className="fake-focus" />
  </Container>
);

export const Error = () => (
  <Container>
    <TextInput title="Error Input" placeholder="Error" state="error" />
    <TextInput title="Error Input" placeholder="Error" state="error" />
  </Container>
);

export const Success = () => (
  <Container>
    <TextInput title="Success Input" placeholder="Success" state="success" />
    <TextInput title="Success Input" placeholder="Success" state="success" />
  </Container>
);

export const Disabled = () => (
  <Container>
    <TextInput title="Disabled Input" placeholder="Disabled" disabled />
    <TextInput title="Disabled Input" placeholder="Disabled" disabled />
  </Container>
);

export const Active = () => (
  <Container>
    <TextInput title="Active State Input" value="Active by state" state={"active"}/>
    <TextInput title="Active Value Input" value="Active by value" />
  </Container>
)

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

export const InputWithRequiredFields = () => (
  <Container>
    <TextInput
      required
      title="Input with required fields"
      value="Input"
      subtitle="A good password has at least 15 characters."
    />
  </Container>
)

export const InputSizes = () => (
  <Container>
    <Spacer>
      <TextInput
        title="Small Input"
        variation={'small'}
        value={"Small Input"}
        subtitle={"A small input field"}
        />
    </Spacer>
    <Spacer>
      <TextInput
        title="Regular Input"
        variation={'medium'}
        value={"Regular Input"}
        subtitle={"A regular input field"}
      />
    </Spacer>
    <Spacer>
      <TextInput
        title="Large Input"
        variation={'large'}
        value={"Large Input"}
        subtitle={"A large input field"}
      />
    </Spacer>
  </Container>
)

export default meta;
