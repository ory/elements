import {
  SelfServiceLoginFlow,
  SelfServiceRecoveryFlow,
  SelfServiceRegistrationFlow,
} from "@ory/client"
import { ComponentMeta, Story } from "@storybook/react"
import { UserAuthCard, UserAuthCardProps } from "../../react-components"
import { Container } from "../storyhelper"

import loginFlow2FA from "./login-flow-2fa.json"
import loginFlow from "./login-flow.json"

import loginFlowError from "./login-flow-error.json"
import loginFlowUiError from "./login-flow-ui-error.json"

import registrationFlowWebAuthn from "./register-flow-webauthn.json"
import registrationFlow from "./register-flow.json"

import recoveryFlow from "./recovery-flow.json"

import verificationFlow from "./verification-flow.json"

import logo from "../assets/logo.svg"

export default {
  title: "Ory/SelfServiceFlowCard",
  component: UserAuthCard,
} as ComponentMeta<typeof UserAuthCard>

const Template: Story<UserAuthCardProps> = (args: UserAuthCardProps) => (
  <Container>
    <UserAuthCard {...args} />
  </Container>
)

export const LoginAuthCard = Template.bind({})

LoginAuthCard.args = {
  title: "Sign in to your Acme account",
  flow: loginFlow as SelfServiceLoginFlow,
  flowType: "login",
  cardImage: logo,
  additionalProps: {
    signupURL: "https://acme.com/login",
    forgotPasswordURL: "https://acme.com/forgot-password",
    logoutURL: "https://acme.com/logout",
  },
}

export const LoginAuthCardWithHydraClient = Template.bind({})

LoginAuthCardWithHydraClient.args = {
  title: "Sign in to your Acme account",
  subtitle: "To authenticate client X",
  flow: loginFlow as SelfServiceLoginFlow,
  flowType: "login",
  cardImage: logo,
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
  includeScripts: true,
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

export const LoginAuthCardUiError = Template.bind({})

LoginAuthCardUiError.args = {
  title: "Sign in to your Acme account",
  flow: loginFlowUiError as SelfServiceLoginFlow,
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
  cardImage: logo,
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
  includeScripts: true,
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
