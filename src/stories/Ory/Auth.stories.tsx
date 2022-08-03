import React from 'react';
import { ComponentMeta, Story } from '@storybook/react';
import {
  SelfServiceAuthCard,
  SelfServiceAuthCardProps
} from '../../react/ory/self-service-auth-card';
import { Container } from '../storyhelper';

import loginFlow from './login-flow.json';
import { SelfServiceLoginFlow } from '@ory/client';

export default {
  title: 'Ory/SelfServiceFlowCard',
  component: SelfServiceAuthCard,
  argTypes: {
    theme: {
      options: ['light', 'dark'],
      control: { type: 'radio' }
    }
  }
} as ComponentMeta<typeof SelfServiceAuthCard>;

export type SelfServiceAuthCardStoryProps = SelfServiceAuthCardProps & {
  theme: 'light' | 'dark';
};

const Template: Story<SelfServiceAuthCardStoryProps> = (
  args: SelfServiceAuthCardStoryProps
) => (
  <Container theme={args.theme || 'light'}>
    <SelfServiceAuthCard {...args} />
  </Container>
);

export const LoginAuthCard = Template.bind({});

LoginAuthCard.args = {
  flow: loginFlow as SelfServiceLoginFlow
};
