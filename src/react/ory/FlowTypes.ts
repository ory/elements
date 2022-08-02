import {
  SelfServiceLoginFlow,
  SelfServiceRecoveryFlow,
  SelfServiceRegistrationFlow,
  SelfServiceSettingsFlow,
  SelfServiceVerificationFlow
} from '@ory/client'

export type SelfServiceFlow =
  | SelfServiceLoginFlow
  | SelfServiceRecoveryFlow
  | SelfServiceRegistrationFlow
  | SelfServiceSettingsFlow
  | SelfServiceVerificationFlow

export type SelfServiceFlowGroup =
  | 'password'
  | 'default'
  | 'profile'
  | 'oidc'
  | 'link'
  | 'webauthn'
  | 'totp'
  | 'lookup_secret'

// TODO remove this type once the SDK is updated and has this enum
export type UiNodeInputType =
  | 'button'
  | 'submit'
  | 'text'
  | 'password'
  | 'email'
  | 'hidden'
  | 'script'
  | 'input'
  | 'checkbox'
  | 'datetime-local'

export type ErrorProps = {
  code: number
  details: {
    docs: string
    hint: string
    rejectReason: string
  }
  message: string
  status: string
  reason: string
}
