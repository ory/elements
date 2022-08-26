import React from "react"
import { ComponentMeta, Story } from "@storybook/react"
import {
  SelfServiceAuthCard,
  SelfServiceAuthCardProps,
} from "../../react-components"
import { Container } from "../storyhelper"
import {
  SelfServiceLoginFlow,
  SelfServiceRecoveryFlow,
  SelfServiceRegistrationFlow,
} from "@ory/client"

import loginFlow from "./login-flow.json"
import loginFlow2FA from "./login-flow-2fa.json"

import loginFlowError from "./login-flow-error.json"

import registrationFlow from "./register-flow.json"
import registrationFlowWebAuthn from "./register-flow-webauthn.json"

import recoveryFlow from "./recovery-flow.json"

import verificationFlow from "./verification-flow.json"

export default {
  title: "Ory/SelfServiceFlowCard",
  component: SelfServiceAuthCard,
  argTypes: {
    theme: {
      options: ["light", "dark"],
      control: { type: "radio" },
    },
  },
} as ComponentMeta<typeof SelfServiceAuthCard>

export type SelfServiceAuthCardStoryProps = SelfServiceAuthCardProps & {
  theme: "light" | "dark"
}

const Template: Story<SelfServiceAuthCardStoryProps> = (
  args: SelfServiceAuthCardStoryProps,
) => (
  <Container theme={args.theme || "light"}>
    <SelfServiceAuthCard {...args} />
  </Container>
)

export const LoginAuthCard = Template.bind({})

LoginAuthCard.args = {
  title: "Sign in to your Acme account",
  flow: loginFlow as SelfServiceLoginFlow,
  flowType: "login",
  additionalProps: {
    signupURL: "https://acme.com/login",
    forgotPasswordURL: "https://acme.com/forgot-password",
    logoutURL: "https://acme.com/logout",
  },
}

export const LoginAuthCard2FA = Template.bind({})

LoginAuthCard2FA.args = {
  title: "Two-factor authentication",
  flow: loginFlow2FA as SelfServiceLoginFlow,
  flowType: "login",
  additionalProps: {
    logoutURL: "https://acme.com/logout",
  },
}

export const LoginAuthCardPasswordless = Template.bind({})

LoginAuthCardPasswordless.args = {
  title: "Sign in with passwordless",
  flow: loginFlow as SelfServiceLoginFlow,
  flowType: "login",
  injectScripts: true,
  additionalProps: {
    logoutURL: "https://acme.com/logout",
    forgotPasswordURL: "https://acme.com/forgot-password",
  },
}

export const LoginAuthCardError = Template.bind({})

LoginAuthCardError.args = {
  title: "Sign in to your Acme account",
  flow: loginFlowError as SelfServiceLoginFlow,
  flowType: "login",
  additionalProps: {
    signupURL: "https://acme.com/login",
    forgotPasswordURL: "https://acme.com/forgot-password",
    logoutURL: "https://acme.com/logout",
  },
}

export const RegistrationAuthCard = Template.bind({})

RegistrationAuthCard.args = {
  title: "Create an account for Acme",
  flow: registrationFlow as SelfServiceRegistrationFlow,
  flowType: "registration",
  additionalProps: {
    loginURL: "https://acme.com/login",
  },
}

export const RegistrationAuthCardWebAuthn = Template.bind({})

RegistrationAuthCardWebAuthn.args = {
  title: "Create an account for Acme",
  flow: registrationFlowWebAuthn as SelfServiceRegistrationFlow,
  flowType: "registration",
  injectScripts: true,
  additionalProps: {
    loginURL: "https://acme.com/login",
  },
}

export const RecoveryAuthCard = Template.bind({})

RecoveryAuthCard.args = {
  title: "Recover your Acme account",
  flow: recoveryFlow as SelfServiceRecoveryFlow,
  flowType: "recovery",
  additionalProps: {
    loginURL: "https://acme.com/login",
  },
}

export const VerificationAuthCard = Template.bind({})

VerificationAuthCard.args = {
  title: "Verify your Acme account",
  flow: verificationFlow as SelfServiceLoginFlow,
  flowType: "verification",
  additionalProps: {
    signupURL: "https://acme.com/login",
  },
}
