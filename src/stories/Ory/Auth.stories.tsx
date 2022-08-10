import React from 'react';
import { ComponentMeta, Story } from '@storybook/react';
import {
  SelfServiceAuthCard,
  SelfServiceAuthCardProps
} from '../../react/ory/self-service-auth-card';
import { Container } from '../storyhelper';

import loginFlow from './login-flow.json';
import registrationFlow from './register-flow.json';
import recoveryFlow from './recovery-flow.json';
import verificationFlow from './verification-flow.json';

import {
  SelfServiceLoginFlow,
  SelfServiceRecoveryFlow,
  SelfServiceRegistrationFlow
} from '@ory/client';

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
  title: 'Sign in to your Acme account',
  flow: loginFlow as SelfServiceLoginFlow,
  flowType: 'login',
  additionalProps: {
    signupUrl: 'https://acme.com/login',
    forgotPasswordUrl: 'https://acme.com/forgot-password',
    logoutUrl: 'https://acme.com/logout'
  }
};

export const RegistrationAuthCard = Template.bind({});

RegistrationAuthCard.args = {
  title: 'Create an account for Acme',
  flow: registrationFlow as SelfServiceRegistrationFlow,
  flowType: 'registration',
  additionalProps: {
    loginUrl: 'https://acme.com/login'
  }
};

export const RecoveryAuthCard = Template.bind({});

RecoveryAuthCard.args = {
  title: 'Recover your Acme account',
  flow: recoveryFlow as SelfServiceRecoveryFlow,
  flowType: 'recovery',
  additionalProps: {
    loginUrl: 'https://acme.com/login'
  }
};

export const VerificationAuthCard = Template.bind({});

VerificationAuthCard.args = {
  title: 'Verify your Acme account',
  flow: verificationFlow as SelfServiceLoginFlow,
  flowType: 'verification',
  additionalProps: {
    signupUrl: 'https://acme.com/login'
  }
};
