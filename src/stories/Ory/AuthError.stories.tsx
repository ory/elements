import React from 'react';
import { SelfServiceError } from '@ory/client';
import { ComponentMeta, Story } from '@storybook/react';
import { SelfServiceErrorCard, SelfServiceErrorCardProps } from '../../react';
import { Container } from '../storyhelper';

import authError from './auth-error.json';

export default {
  title: 'Ory/SelfServiceErrorCard',
  component: SelfServiceErrorCard,
  argTypes: {
    theme: {
      options: ['light', 'dark'],
      control: { type: 'radio' }
    }
  }
} as ComponentMeta<typeof SelfServiceErrorCard>;

export type SelfServiceAuthCardStoryProps = SelfServiceErrorCardProps & {
  theme: 'light' | 'dark';
};

const Template: Story<SelfServiceAuthCardStoryProps> = (
  args: SelfServiceAuthCardStoryProps
) => (
  <Container theme={args.theme || 'light'}>
    <SelfServiceErrorCard {...args} />
  </Container>
);

export const ErrorAuthCard = Template.bind({});

ErrorAuthCard.args = {
  title: 'An error occurred',
  error: authError as SelfServiceError,
  backURL: 'https://acme.com/login',
  contactSupportEmail: 'help@help.com'
};
