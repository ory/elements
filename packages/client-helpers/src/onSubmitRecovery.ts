// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { frontendClient } from "./index"
import { handleFlowError, OnSubmitHandlerProps } from "./utils"
import { RecoveryFlow, UpdateRecoveryFlowBody } from "@ory/client-fetch"
import { handleContinueWith } from "./continueWith"
import { recoveryUrl } from "./urlHelpers"
import { FlowContainer, FlowType } from "./flowTypes"

/**
 * Use this method to submit a recovery flow. This method is used in the `onSubmit` handler of the recovery form.
 *
 * @param config The configuration object.
 * @param flow The flow object.
 * @param setFlowContainer This method is used to update the flow container when a validation error occurs, for example.
 * @param body The form values to submit.
 * @param onRedirect This method is used to redirect the user to a different page.
 */
export async function onSubmitRecovery(
  { config, flow }: FlowContainer,
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

      const didContinueWith = await handleContinueWith(flow.continue_with, {
        onRedirect,
      })

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
        onRestartFlow: () => {
          onRedirect(recoveryUrl(config), true)
        },
        onValidationError: (body: RecoveryFlow) => {
          setFlowContainer({
            flow: body,
            flowType: FlowType.Recovery,
          })
        },
        onRedirect,
      }),
    )
}
