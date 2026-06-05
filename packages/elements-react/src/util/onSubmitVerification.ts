// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  type UpdateVerificationFlowBody,
  type VerificationFlow,
  verificationUrl,
} from "@ory/client-fetch"
import type { OryElementsConfiguration } from "../context"
import type { OryFlowContainer } from "./flowContainer"
import { replaceWindowFlowId } from "./internal"
import type { OnSubmitHandlerProps } from "./submitHandler"
import { handleFlowError } from "./sdk-helpers"
import { flowHasErrors } from "./flowHasErrors"

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
    onSuccess,
    onValidationError,
    onError,
  }: OnSubmitHandlerProps<UpdateVerificationFlowBody>,
) {
  const method = String(body.method)

  await config.sdk.frontend
    .updateVerificationFlowRaw({
      flow: flow.id,
      updateVerificationFlowBody: body,
    })
    .then(async (res) => {
      const flow = await res.value()

      await onSuccess?.({
        flowType: FlowType.Verification,
        method,
        flow,
      })

      return setFlowContainer({
        flow,
        flowType: FlowType.Verification,
      })
    })
    .catch(
      handleFlowError({
        onRestartFlow: (useFlowId) => {
          if (useFlowId) {
            replaceWindowFlowId(useFlowId)
          } else {
            onRedirect(verificationUrl(config), true)
          }
        },
        onValidationError: async (body: VerificationFlow) => {
          if (flowHasErrors(body.ui)) {
            await onValidationError?.({
              flowType: FlowType.Verification,
              flow: body,
            })
          }
          setFlowContainer({
            flow: body,
            flowType: FlowType.Verification,
          })
        },
        onRedirect,
        config,
        flowType: FlowType.Verification,
        onError,
      }),
    )
}
