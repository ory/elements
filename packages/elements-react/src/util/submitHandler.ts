// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  OnRedirectHandler,
  UpdateLoginFlowBody,
  UpdateRecoveryFlowBody,
  UpdateRegistrationFlowBody,
  UpdateSettingsFlowBody,
  UpdateVerificationFlowBody,
} from "@ory/client-fetch"
import { FlowContainer } from "./flowContainer"

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
  setFlowContainer: (flowContainer: FlowContainer) => void

  /**
   * The form values to submit.
   */
  body: T

  /**
   * This method is used to redirect the user to a different page.
   */
  onRedirect: OnRedirectHandler
}
