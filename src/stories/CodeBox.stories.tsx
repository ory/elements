import React from 'react';
import { Meta } from '@storybook/react';
import { Story } from '@storybook/react/types-6-0';
import { Container, Spacer } from './storyhelper';
import CodeBox, { CodeBoxProps } from '../components/CodeBox';

const meta: Meta = {
  title: 'CodeBox',
  component: CodeBox
};

const Template: Story<CodeBoxProps> = (args: CodeBoxProps) => (
  <Container>
    <CodeBox {...args} />
  </Container>
);

export const Playground = Template.bind({});
Playground.args = {
  code: `HTTP 1.0 /example
Authorization: foo-bar
Cookie: Yummy!`
};

export const CheckboxWithTitleDescription = () => (
  <Container>
    <Spacer>
      <CodeBox
        code={`HTTP 1.0 /example
Authorization: foo-bar
Cookie: Yummy!`}
      />
    </Spacer>
  </Container>
);

export default meta;
