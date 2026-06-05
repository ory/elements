// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type {
  OnRedirectHandler,
  UpdateLoginFlowBody,
  UpdateRecoveryFlowBody,
  UpdateRegistrationFlowBody,
  UpdateSettingsFlowBody,
  UpdateVerificationFlowBody,
} from "@ory/client-fetch"
import type { OryFlowContainer } from "./flowContainer"
import type {
  OryErrorHandler,
  OrySuccessHandler,
  OryValidationErrorHandler,
} from "./events"

/**
 * Props for the submit handler
 */
export type OnSubmitHandlerProps<
  T extends
    | UpdateLoginFlowBody
    | UpdateRegistrationFlowBody
    | UpdateVerificationFlowBody
    | UpdateRecoveryFlowBody
    | UpdateSettingsFlowBody,
> = {
  /**
   * This method is used to update the flow container when a validation error occurs, for example.
   */
  setFlowContainer: (flowContainer: OryFlowContainer) => void

  /**
   * The form values to submit.
   */
  body: T

  /**
   * This method is used to redirect the user to a different page.
   */
  onRedirect: OnRedirectHandler

  /**
   * Optional callback invoked after a successful submission, before the default
   * behavior (redirect, flow update). Awaited if it returns a Promise.
   */
  onSuccess?: OrySuccessHandler

  /**
   * Optional callback invoked when the server returns validation errors.
   * Awaited if it returns a Promise.
   */
  onValidationError?: OryValidationErrorHandler

  /**
   * Optional callback invoked on infrastructure or flow-level errors (expired
   * flow, CSRF, not found, replaced). Awaited if it returns a Promise.
   */
  onError?: OryErrorHandler
}
