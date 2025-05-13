// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  ContinueWith,
  FlowType,
  GenericError,
  handleContinueWith,
  instanceOfContinueWithRecoveryUi,
  OnRedirectHandler,
  RecoveryFlow,
  recoveryUrl,
  UpdateRecoveryFlowBody,
} from "@ory/client-fetch"
import { OryElementsConfiguration } from "../context"
import { OryFlowContainer } from "./flowContainer"
import { replaceWindowFlowId } from "./internal"
import { OnSubmitHandlerProps } from "./submitHandler"
import { handleFlowError } from "./sdk-helpers"

/**
 * Use this method to submit a recovery flow. This method is used in the `onSubmit` handler of the recovery form.
 *
 * @param config - The configuration object.
 * @param flow - The flow object.
 * @param setFlowContainer - This method is used to update the flow container when a validation error occurs, for example.
 * @param body - The form values to submit.
 * @param onRedirect - This method is used to redirect the user to a different page.
 */
export async function onSubmitRecovery(
  { flow }: OryFlowContainer,
  config: OryElementsConfiguration,
  {
    setFlowContainer,
    body,
    onRedirect,
  }: OnSubmitHandlerProps<UpdateRecoveryFlowBody>,
) {
  await config.sdk.frontend
    .updateRecoveryFlowRaw({
      flow: flow.id,
      updateRecoveryFlowBody: body,
    })
    .then(async (res) => {
      const flow = await res.value()

      const didContinueWith = handleContinueWith(flow.continue_with, {
        onRedirect,
      })

      // eslint-disable-next-line promise/always-return
      if (didContinueWith) {
        return
      }

      setFlowContainer({
        flow,
        flowType: FlowType.Recovery,
      })
    })
    .catch(
      handleFlowError({
        onRestartFlow: (useFlowId) => {
          if (useFlowId) {
            replaceWindowFlowId(useFlowId)
          } else {
            onRedirect(recoveryUrl(config), true)
          }
        },
        onValidationError: (body: RecoveryFlow | { error: GenericError }) => {
          if ("error" in body) {
            handleContinueWithRecoveryUIError(body.error, config, onRedirect)
            return
          } else {
            setFlowContainer({
              flow: body,
              flowType: FlowType.Recovery,
            })
          }
        },
        onRedirect,
        config,
      }),
    )
}

function handleContinueWithRecoveryUIError(
  error: GenericError,
  config: OryElementsConfiguration,
  onRedirect: OnRedirectHandler,
) {
  if (
    "continue_with" in error.details &&
    Array.isArray(error.details.continue_with)
  ) {
    const continueWithRecovery = (
      error.details.continue_with as ContinueWith[]
    ).find(instanceOfContinueWithRecoveryUi)
    if (continueWithRecovery?.action === "show_recovery_ui") {
      onRedirect(
        config.project.recovery_ui_url +
          "?flow=" +
          continueWithRecovery?.flow.id,
        false,
      )
      return
    }
  }
  onRedirect(recoveryUrl(config), true)
}
