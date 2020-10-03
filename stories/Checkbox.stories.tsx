import React from 'react';
import { Meta } from '@storybook/react';
import { Story } from '@storybook/react/types-6-0';
import { Container, Spacer } from './storyhelper';
import Checkbox, { CheckboxProps } from './Checkbox';

const meta: Meta = {
  title: 'Checkbox',
  component: Checkbox
};

const Template: Story<CheckboxProps> = (args: CheckboxProps) => (
  <Container>
    <Checkbox {...args} />
  </Container>
);

export const Playground = Template.bind({});
Playground.args = {
  label: 'Send me occasional updates and announcements with newsletters'
};

export const CheckboxWithTitleDescription = () => (
  <Container>
    <Spacer>
      <Checkbox
        title="Preferences"
        label="Send me occasional updates and announcements with newsletters"
      />
    </Spacer>
  </Container>
);

export default meta;
