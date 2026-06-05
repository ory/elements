// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  type ContinueWith,
  FlowType,
  type GenericError,
  handleContinueWith,
  instanceOfContinueWithRecoveryUi,
  type OnRedirectHandler,
  type RecoveryFlow,
  recoveryUrl,
  type UpdateRecoveryFlowBody,
} from "@ory/client-fetch"
import type { OryElementsConfiguration } from "../context"
import type { OryFlowContainer } from "./flowContainer"
import { replaceWindowFlowId } from "./internal"
import type { OnSubmitHandlerProps } from "./submitHandler"
import { handleFlowError } from "./sdk-helpers"
import { flowHasErrors } from "./flowHasErrors"

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
    onSuccess,
    onValidationError,
    onError,
  }: OnSubmitHandlerProps<UpdateRecoveryFlowBody>,
) {
  const method = String(body.method)

  await config.sdk.frontend
    .updateRecoveryFlowRaw({
      flow: flow.id,
      updateRecoveryFlowBody: body,
    })
    .then(async (res) => {
      const flow = await res.value()

      await onSuccess?.({
        flowType: FlowType.Recovery,
        method,
        flow,
      })

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
        onValidationError: async (
          body: RecoveryFlow | { error: GenericError },
        ) => {
          if ("error" in body) {
            handleContinueWithRecoveryUIError(body.error, config, onRedirect)
            return
          } else {
            if (flowHasErrors(body.ui)) {
              await onValidationError?.({
                flowType: FlowType.Recovery,
                flow: body,
              })
            }
            setFlowContainer({
              flow: body,
              flowType: FlowType.Recovery,
            })
          }
        },
        onRedirect,
        config,
        flowType: FlowType.Recovery,
        onError,
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
