import {
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  VerificationFlow,
} from "@ory/client"
import { ComponentMeta, Story } from "@storybook/react"
import { UserAuthCard, UserAuthCardProps } from "../../react-components"
import { Container } from "../storyhelper"

import loginFlow2FA from "./login-flow-2fa.json"
import loginFlowRefresh from "./login-flow-refresh.json"
import loginFlow from "./login-flow.json"
import loginFlowCodeOne from "./login-flow-code-1.json"
import loginFlowCodeTwo from "./login-flow-code-2.json"
import loginFlowHydra from "./login-flow-hydra.json"

import loginFlowError from "./login-flow-error.json"
import loginFlowUiError from "./login-flow-ui-error.json"

import registrationFlowWebAuthn from "./register-flow-webauthn.json"
import registrationFlow from "./register-flow.json"

import recoveryFlow from "./recovery-flow.json"

import verificationFlow from "./verification-flow.json"
import verificationSubmitted from "./verification-submit-flow.json"

import logo from "../assets/logo.svg"

export default {
  title: "Ory/UserAuthCard",
  component: UserAuthCard,
} as ComponentMeta<typeof UserAuthCard>

const Template: Story<UserAuthCardProps> = (args: UserAuthCardProps) => (
  <Container>
    <UserAuthCard {...args} />
  </Container>
)

export const LoginAuthCard = Template.bind({})

LoginAuthCard.args = {
  flow: loginFlow as LoginFlow,
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
  flow: loginFlowHydra as LoginFlow,
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
  flow: loginFlow2FA as LoginFlow,
  flowType: "login",
  additionalProps: {
    logoutURL: "https://acme.com/logout",
  },
}

export const LoginAuthCardPasswordless = Template.bind({})

LoginAuthCardPasswordless.args = {
  flow: loginFlow as LoginFlow,
  flowType: "login",
  includeScripts: true,
  additionalProps: {
    logoutURL: "https://acme.com/logout",
    forgotPasswordURL: "https://acme.com/forgot-password",
  },
}

export const LoginAuthCardRefresh = Template.bind({})

LoginAuthCardRefresh.args = {
  flow: loginFlowRefresh as LoginFlow,
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
  flow: loginFlowError as LoginFlow,
  flowType: "login",
  additionalProps: {
    signupURL: "https://acme.com/login",
    forgotPasswordURL: "https://acme.com/forgot-password",
    logoutURL: "https://acme.com/logout",
  },
}

export const LoginAuthCardUiError = Template.bind({})

LoginAuthCardUiError.args = {
  flow: loginFlowUiError as LoginFlow,
  flowType: "login",
  additionalProps: {
    signupURL: "https://acme.com/login",
    forgotPasswordURL: "https://acme.com/forgot-password",
    logoutURL: "https://acme.com/logout",
  },
}

export const LoginAuthCardWithoutRegistrationUrl = Template.bind({})

LoginAuthCardWithoutRegistrationUrl.args = {
  flow: loginFlow as LoginFlow,
  flowType: "login",
  additionalProps: {
    forgotPasswordURL: "https://acme.com/forgot-password",
  },
}

export const LoginAuthCardWithCodeInit = Template.bind({})

LoginAuthCardWithCodeInit.args = {
  flow: loginFlowCodeOne as LoginFlow,
  flowType: "login",
  additionalProps: {
    forgotPasswordURL: "https://acme.com/forgot-password",
  },
}

export const LoginAuthCardWithCodeSubmit = Template.bind({})

LoginAuthCardWithCodeSubmit.args = {
  flow: loginFlowCodeTwo as LoginFlow,
  flowType: "login",
  additionalProps: {
    forgotPasswordURL: "https://acme.com/forgot-password",
  },
}

export const LoginAuthCardWithoutAdditionalProps = Template.bind({})

LoginAuthCardWithoutAdditionalProps.args = {
  flow: loginFlow as LoginFlow,
  flowType: "login",
}

export const RegistrationAuthCard = Template.bind({})

RegistrationAuthCard.args = {
  flow: registrationFlow as RegistrationFlow,
  cardImage: logo,
  flowType: "registration",
  additionalProps: {
    loginURL: "https://acme.com/login",
  },
}

export const RegistrationAuthCardWebAuthn = Template.bind({})

RegistrationAuthCardWebAuthn.args = {
  flow: registrationFlowWebAuthn as RegistrationFlow,
  flowType: "registration",
  includeScripts: true,
  additionalProps: {
    loginURL: "https://acme.com/login",
  },
}

export const RegistrationAuthCardWithoutAdditionalProps = Template.bind({})
RegistrationAuthCardWithoutAdditionalProps.args = {
  flow: registrationFlow as RegistrationFlow,
  flowType: "registration",
}

export const RecoveryAuthCard = Template.bind({})

RecoveryAuthCard.args = {
  title: "Recover your Acme account",
  flow: recoveryFlow as RecoveryFlow,
  flowType: "recovery",
  additionalProps: {
    loginURL: "https://acme.com/login",
  },
}

export const RecoveryAuthCardWithoutAdditionalProps = Template.bind({})
RecoveryAuthCardWithoutAdditionalProps.args = {
  flow: recoveryFlow as RecoveryFlow,
  flowType: "recovery",
}

export const VerificationAuthCard = Template.bind({})

VerificationAuthCard.args = {
  flow: verificationFlow as VerificationFlow,
  flowType: "verification",
  additionalProps: {
    signupURL: "https://acme.com/login",
  },
}

export const VerificationSubmittedAuthCard = Template.bind({})

VerificationSubmittedAuthCard.args = {
  flow: verificationSubmitted as VerificationFlow,
  flowType: "verification",
  additionalProps: {
    signupURL: "https://acme.com/login",
  },
}

export const VerificationAuthCardWithoutAdditionalProps = Template.bind({})

VerificationAuthCardWithoutAdditionalProps.args = {
  flow: verificationFlow as VerificationFlow,
  flowType: "verification",
}
