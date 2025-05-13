// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  UpdateVerificationFlowBody,
  VerificationFlow,
  verificationUrl,
} from "@ory/client-fetch"
import { OryElementsConfiguration } from "../context"
import { OryFlowContainer } from "./flowContainer"
import { replaceWindowFlowId } from "./internal"
import { OnSubmitHandlerProps } from "./submitHandler"
import { handleFlowError } from "./sdk-helpers"

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
  { flow }: OryFlowContainer,
  config: OryElementsConfiguration,
  {
    setFlowContainer,
    body,
    onRedirect,
  }: OnSubmitHandlerProps<UpdateVerificationFlowBody>,
) {
  await config.sdk.frontend
    .updateVerificationFlowRaw({
      flow: flow.id,
      updateVerificationFlowBody: body,
    })
    .then(async (res) =>
      setFlowContainer({
        flow: await res.value(),
        flowType: FlowType.Verification,
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
          })
        },
        onRedirect,
        config,
      }),
    )
}
