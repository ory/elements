// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  type ErrorFlowReplaced,
  FlowType,
  type GenericError,
  type Identity,
  type LoginFlow,
  type OAuth2ConsentRequest,
  type RecoveryFlow,
  type RegistrationFlow,
  type SelfServiceFlowExpiredError,
  type Session,
  type SettingsFlow,
  type VerificationFlow,
} from "@ory/client-fetch"

// ---------------------------------------------------------------------------
// Success events — discriminated on `flowType`
// ---------------------------------------------------------------------------

/**
 * Event fired after a successful login, before the redirect.
 *
 * `session.identity` contains the authenticated user. Use `session.identity.id`
 * for analytics session stitching (e.g., `mixpanel.identify`).
 *
 * @group Events
 */
export type OryLoginSuccessEvent = {
  flowType: FlowType.Login
  flow: LoginFlow
  session: Session
  method: string
}

/**
 * Event fired after a successful registration, before the redirect.
 *
 * @group Events
 */
export type OryRegistrationSuccessEvent = {
  flowType: FlowType.Registration
  flow: RegistrationFlow
  identity: Identity
  session?: Session
  method: string
}

/**
 * Event fired after a successful verification submission.
 *
 * This fires when the server accepts the verification form (e.g., a code was
 * submitted). It does not necessarily mean the identity is verified — check the
 * flow state for that.
 *
 * @group Events
 */
export type OryVerificationSuccessEvent = {
  flowType: FlowType.Verification
  flow: VerificationFlow
  method: string
}

/**
 * Event fired after a successful recovery submission.
 *
 * This fires when the server accepts the recovery form (e.g., a code or email
 * was submitted). The user may still need to complete additional steps.
 *
 * @group Events
 */
export type OryRecoverySuccessEvent = {
  flowType: FlowType.Recovery
  flow: RecoveryFlow
  method: string
}

/**
 * Event fired after a successful settings update.
 *
 * @group Events
 */
export type OrySettingsSuccessEvent = {
  flowType: FlowType.Settings
  flow: SettingsFlow
  method: string
}

/**
 * Event fired after a successful OAuth2 consent submission.
 *
 * @group Events
 */
export type OryConsentSuccessEvent = {
  flowType: FlowType.OAuth2Consent
  consentRequest: OAuth2ConsentRequest
}

/**
 * Discriminated union of all success events emitted by Ory Elements.
 *
 * Use the `flowType` field to narrow:
 * ```ts
 * onSuccess={async (event) => {
 *   if (event.flowType === FlowType.Login) {
 *     await mixpanel.identify(event.session.identity.id)
 *   }
 * }}
 * ```
 *
 * @group Events
 */
export type OrySuccessEvent =
  | OryLoginSuccessEvent
  | OryRegistrationSuccessEvent
  | OryVerificationSuccessEvent
  | OryRecoverySuccessEvent
  | OrySettingsSuccessEvent
  | OryConsentSuccessEvent

// ---------------------------------------------------------------------------
// Validation error events — discriminated on `flowType`
// ---------------------------------------------------------------------------

/**
 * Discriminated union of validation error events. Each variant carries the
 * updated flow object. Consumers extract messages from `flow.ui` themselves.
 *
 * @group Events
 */
export type OryValidationErrorEvent =
  | { flowType: FlowType.Login; flow: LoginFlow }
  | { flowType: FlowType.Registration; flow: RegistrationFlow }
  | { flowType: FlowType.Verification; flow: VerificationFlow }
  | { flowType: FlowType.Recovery; flow: RecoveryFlow }
  | { flowType: FlowType.Settings; flow: SettingsFlow }

// ---------------------------------------------------------------------------
// Error events — discriminated on `type`
// ---------------------------------------------------------------------------

/**
 * Discriminated union of infrastructure/flow error events. Uses SDK error types
 * from `@ory/client-fetch`.
 *
 * @group Events
 */
export type OryErrorEvent =
  | {
      type: "flow_expired"
      flowType: FlowType
      body: SelfServiceFlowExpiredError
    }
  | { type: "csrf_error"; flowType: FlowType; body: GenericError }
  | { type: "flow_not_found"; flowType: FlowType }
  | { type: "flow_replaced"; flowType: FlowType; body: ErrorFlowReplaced }
  | {
      type: "consent_error"
      flowType: FlowType.OAuth2Consent
      consentRequest: OAuth2ConsentRequest
    }

// ---------------------------------------------------------------------------
// Handler types
// ---------------------------------------------------------------------------

/**
 * Callback invoked on a successful flow submission. Returning a `Promise`
 * delays the default behavior (redirect, flow update) until the promise
 * resolves.
 *
 * @group Events
 */
export type OrySuccessHandler = (event: OrySuccessEvent) => void | Promise<void>

/**
 * Callback invoked when the server returns validation errors for a form
 * submission.
 *
 * @group Events
 */
export type OryValidationErrorHandler = (
  event: OryValidationErrorEvent,
) => void | Promise<void>

/**
 * Callback invoked on infrastructure or flow-level errors (expired flow, CSRF
 * violation, flow not found, flow replaced).
 *
 * @group Events
 */
export type OryErrorHandler = (event: OryErrorEvent) => void | Promise<void>
