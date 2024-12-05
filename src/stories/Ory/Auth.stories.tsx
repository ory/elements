// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Meta, StoryFn } from "@storybook/react"
import { UserAuthCard, UserAuthCardProps } from "../../react-components"
import { Container } from "../storyhelper"

import {
  loginFlowTwoFactor,
  loginFlowRefresh,
  loginFlow,
  loginFlowCodeStepOne,
  loginFlowCodeStepTwo,
  loginFlowHydra,
  loginFlowError,
  loginFlowUiError,
  loginFlowWithPasskey,
} from "./login-data"

import {
  registrationFlow,
  registrationWebAuthnFlow,
  registrationFlowCode,
} from "./registration-data"

import { recoveryFlow } from "./recovery-data"

import { verificationFlow, verificationFlowSubmit } from "./verification-data"

import logo from "../assets/logo.svg"

export default {
  title: "Ory/UserAuthCard",
  component: UserAuthCard,
} as Meta<typeof UserAuthCard>

const Template: StoryFn<UserAuthCardProps> = (args: UserAuthCardProps) => (
  <Container>
    <UserAuthCard {...args} />
  </Container>
)

export const LoginAuthCard = Template.bind({})

LoginAuthCard.args = {
  flow: loginFlow,
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
  flow: loginFlowHydra,
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
  flow: loginFlowTwoFactor,
  flowType: "login",
  additionalProps: {
    logoutURL: "https://acme.com/logout",
  },
}

export const LoginAuthCardPasswordless = Template.bind({})

LoginAuthCardPasswordless.args = {
  flow: loginFlow,
  flowType: "login",
  includeScripts: true,
  additionalProps: {
    logoutURL: "https://acme.com/logout",
    forgotPasswordURL: "https://acme.com/forgot-password",
  },
}

export const LoginAuthCardPasskey = Template.bind({})

LoginAuthCardPasskey.args = {
  flow: loginFlowWithPasskey,
  flowType: "login",
  includeScripts: true,
  additionalProps: {
    logoutURL: "https://acme.com/logout",
    forgotPasswordURL: "https://acme.com/forgot-password",
  },
}

export const LoginAuthCardRefresh = Template.bind({})

LoginAuthCardRefresh.args = {
  flow: loginFlowRefresh,
  flowType: "login",
  cardImage: logo,
  includeScripts: true,
  additionalProps: {
    logoutURL: "https://acme.com/logout",
    forgotPasswordURL: "https://acme.com/forgot-password",
  },
}

export const LoginAuthCardError = Template.bind({})

LoginAuthCardError.args = {
  flow: loginFlowError,
  flowType: "login",
  additionalProps: {
    signupURL: "https://acme.com/login",
    forgotPasswordURL: "https://acme.com/forgot-password",
    logoutURL: "https://acme.com/logout",
  },
}

export const LoginAuthCardUiError = Template.bind({})

LoginAuthCardUiError.args = {
  flow: loginFlowUiError,
  flowType: "login",
  additionalProps: {
    signupURL: "https://acme.com/login",
    forgotPasswordURL: "https://acme.com/forgot-password",
    logoutURL: "https://acme.com/logout",
  },
}

export const LoginAuthCardWithoutRegistrationUrl = Template.bind({})

LoginAuthCardWithoutRegistrationUrl.args = {
  flow: loginFlow,
  flowType: "login",
  additionalProps: {
    forgotPasswordURL: "https://acme.com/forgot-password",
  },
}

export const LoginAuthCardWithCodeInit = Template.bind({})

LoginAuthCardWithCodeInit.args = {
  flow: loginFlowCodeStepOne,
  flowType: "login",
  additionalProps: {
    forgotPasswordURL: "https://acme.com/forgot-password",
  },
}

export const LoginAuthCardWithCodeSubmit = Template.bind({})

LoginAuthCardWithCodeSubmit.args = {
  flow: loginFlowCodeStepTwo,
  flowType: "login",
  additionalProps: {
    forgotPasswordURL: "https://acme.com/forgot-password",
  },
}

export const LoginAuthCardWithoutAdditionalProps = Template.bind({})

LoginAuthCardWithoutAdditionalProps.args = {
  flow: loginFlow,
  flowType: "login",
}

export const RegistrationAuthCard = Template.bind({})

RegistrationAuthCard.args = {
  flow: registrationFlow,
  cardImage: logo,
  flowType: "registration",
  additionalProps: {
    loginURL: "https://acme.com/login",
  },
}

export const RegistrationAuthCardWebAuthn = Template.bind({})

RegistrationAuthCardWebAuthn.args = {
  flow: registrationWebAuthnFlow,
  flowType: "registration",
  includeScripts: true,
  additionalProps: {
    loginURL: "https://acme.com/login",
  },
}

export const RegistrationAuthCardWithoutAdditionalProps = Template.bind({})
RegistrationAuthCardWithoutAdditionalProps.args = {
  flow: registrationFlow,
  flowType: "registration",
}

export const RegistrationAuthCardFlowCode = Template.bind({})
RegistrationAuthCardFlowCode.args = {
  flow: registrationFlowCode,
  flowType: "registration",
}

export const RecoveryAuthCard = Template.bind({})

RecoveryAuthCard.args = {
  title: "Recover your Acme account",
  flow: recoveryFlow,
  flowType: "recovery",
  additionalProps: {
    loginURL: "https://acme.com/login",
  },
}

export const RecoveryAuthCardWithoutAdditionalProps = Template.bind({})

RecoveryAuthCardWithoutAdditionalProps.args = {
  flow: recoveryFlow,
  flowType: "recovery",
}
export const VerificationAuthCard = Template.bind({})

VerificationAuthCard.args = {
  flow: verificationFlow,
  flowType: "verification",
  additionalProps: {
    signupURL: "https://acme.com/login",
  },
}

export const VerificationSubmittedAuthCard = Template.bind({})

VerificationSubmittedAuthCard.args = {
  flow: verificationFlowSubmit,
  flowType: "verification",
  additionalProps: {
    signupURL: "https://acme.com/login",
  },
}

export const VerificationAuthCardWithoutAdditionalProps = Template.bind({})

VerificationAuthCardWithoutAdditionalProps.args = {
  flow: verificationFlow,
  flowType: "verification",
}
