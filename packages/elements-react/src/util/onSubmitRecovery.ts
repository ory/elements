// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  ContinueWith,
  FlowType,
  GenericError,
  handleContinueWith,
  handleFlowError,
  instanceOfContinueWithRecoveryUi,
  OnRedirectHandler,
  RecoveryFlow,
  recoveryUrl,
  UpdateRecoveryFlowBody,
} from "@ory/client-fetch"
import { frontendClient } from "./client"
import { OryClientConfiguration } from "./clientConfiguration"
import { OryFlowContainer } from "./flowContainer"
import { OnSubmitHandlerProps } from "./submitHandler"

/**
 * Use this method to submit a recovery flow. This method is used in the `onSubmit` handler of the recovery form.
 *
 * @param config - The configuration object.
 * @param flow - The flow object.
 * @param setFlowContainer - This method is used to update the flow container when a validation error occurs, for example.
 * @param body-  The form values to submit.
 * @param onRedirect - This method is used to redirect the user to a different page.
 */
export async function onSubmitRecovery(
  { config, flow }: OryFlowContainer,
  {
    setFlowContainer,
    body,
    onRedirect,
  }: OnSubmitHandlerProps<UpdateRecoveryFlowBody>,
) {
  if (!config.sdk.url) {
    throw new Error(
      `Please supply your Ory Network SDK url to the Ory Elements configuration.`,
    )
  }

  await frontendClient(config.sdk.url, config.sdk.options ?? {})
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
        config,
      })
    })
    .catch(
      handleFlowError({
        onRestartFlow: () => {
          onRedirect(recoveryUrl(config), true)
        },
        onValidationError: (body: RecoveryFlow | { error: GenericError }) => {
          if ("error" in body) {
            handleContinueWithRecoveryUIError(body.error, config, onRedirect)
            return
          } else {
            setFlowContainer({
              flow: body,
              flowType: FlowType.Recovery,
              config,
            })
          }
        },
        onRedirect,
      }),
    )
}

function handleContinueWithRecoveryUIError(
  error: GenericError,
  config: OryClientConfiguration,
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
