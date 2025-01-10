// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  handleFlowError,
  UpdateVerificationFlowBody,
  VerificationFlow,
  verificationUrl,
} from "@ory/client-fetch"
import { OryFlowContainer } from "./flowContainer"
import { OnSubmitHandlerProps } from "./submitHandler"
import { frontendClient } from "./client"
import { replaceWindowFlowId } from "./internal"

/**
 * Use this method to submit a verification flow. This method is used in the `onSubmit` handler of the verification form.
 *
 * @param config - The configuration object.
 * @param flow - The flow object.
 * @param setFlowContainer - This method is used to update the flow container when a validation error occurs, for example.
 * @param body - The form values to submit.
 * @param onRedirect - This method is used to redirect the user to a different page.
 */
export async function onSubmitVerification(
  { config, flow }: OryFlowContainer,
  {
    setFlowContainer,
    body,
    onRedirect,
  }: OnSubmitHandlerProps<UpdateVerificationFlowBody>,
) {
  if (!config.sdk.url) {
    throw new Error(
      `Please supply your Ory Network SDK URL to the Ory Elements configuration.`,
    )
  }

  await frontendClient(config.sdk.url, config.sdk.options ?? {})
    .updateVerificationFlowRaw({
      flow: flow.id,
      updateVerificationFlowBody: body,
    })
    .then(async (res) =>
      setFlowContainer({
        flow: await res.value(),
        flowType: FlowType.Verification,
        config,
      }),
    )
    .catch(
      handleFlowError({
        onRestartFlow: (useFlowId) => {
          if (useFlowId) {
            replaceWindowFlowId(useFlowId)
          } else {
            onRedirect(verificationUrl(config), true)
          }
        },
        onValidationError: (body: VerificationFlow) => {
          setFlowContainer({
            flow: body,
            flowType: FlowType.Verification,
            config,
          })
        },
        onRedirect,
      }),
    )
}
