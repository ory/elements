import React from 'react';
import { ComponentMeta, Story } from '@storybook/react';
import { Message, MessageProps } from '../react';
import { Container } from './storyhelper';

export default {
  title: 'Component/Message',
  component: Message,
  argTypes: {
    theme: {
      options: ['light', 'dark'],
      control: { type: 'radio' }
    }
  }
} as ComponentMeta<typeof Message>;

export type MessageStoryProps = MessageProps & {
  theme: 'light' | 'dark';
};

const Template: Story<MessageStoryProps> = (args: MessageStoryProps) => (
  <Container theme={args.theme || 'light'}>
    <Message {...args}>I am a Message</Message>
  </Container>
);

export const DefaultMessage = Template.bind({});

export const ErrorMessage = Template.bind({});

ErrorMessage.args = {
  serverity: 'error'
};
