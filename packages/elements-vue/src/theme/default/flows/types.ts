// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type {
  LoginFlow,
  RegistrationFlow,
  RecoveryFlow,
  VerificationFlow,
  SettingsFlow,
  OAuth2ConsentRequest,
  Session,
  FlowError,
  GenericError,
} from "@ory/client-fetch"
import type { OryClientConfiguration } from "../../../composables/useOryConfig"
import type { OryFlowComponentOverrides } from "../../../composables/useComponents"

/**
 * OAuth2 error response type
 */
export type OAuth2Error = {
  error: string
  error_description: string
}

/**
 * Union type of all possible Ory errors
 */
export type OryError = FlowError | OAuth2Error | { error: GenericError }

/**
 * Props for the Login component.
 */
export interface LoginFlowContextProps {
  flow: LoginFlow
  components?: OryFlowComponentOverrides
  config: OryClientConfiguration
}

/**
 * Props for the Registration component.
 */
export interface RegistrationFlowContextProps {
  flow: RegistrationFlow
  components?: OryFlowComponentOverrides
  config: OryClientConfiguration
}

/**
 * Props for the Recovery component.
 */
export interface RecoveryFlowContextProps {
  flow: RecoveryFlow
  components?: OryFlowComponentOverrides
  config: OryClientConfiguration
}

/**
 * Props for the Verification component.
 */
export interface VerificationFlowContextProps {
  flow: VerificationFlow
  components?: OryFlowComponentOverrides
  config: OryClientConfiguration
}

/**
 * Props for the Settings component.
 */
export interface SettingsFlowContextProps {
  flow: SettingsFlow
  components?: OryFlowComponentOverrides
  config: OryClientConfiguration
  className?: string
  session?: Session | null
  logoutUrl?: string
}

/**
 * Props for the Consent component.
 */
export interface ConsentFlowProps {
  consentChallenge: OAuth2ConsentRequest
  session: Session
  config: OryClientConfiguration
  csrfToken: string
  formActionUrl: string
  components?: OryFlowComponentOverrides
}

/**
 * Props for the Error component.
 */
export interface ErrorFlowContextProps {
  error: OryError
  components?: OryFlowComponentOverrides
  config: OryClientConfiguration
  session?: Session | null
}
