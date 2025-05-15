// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  handleContinueWith,
  RegistrationFlow,
  registrationUrl,
  UpdateRegistrationFlowBody,
} from "@ory/client-fetch"
import { OryElementsConfiguration } from "../context"
import { OryFlowContainer } from "./flowContainer"
import { replaceWindowFlowId } from "./internal"
import { OnSubmitHandlerProps } from "./submitHandler"
import { handleFlowError } from "./sdk-helpers"

/**
 * Use this method to submit a registration flow. This method is used in the `onSubmit` handler of the registration form.
 *
 * @param config - The configuration object.
 * @param flow - The flow object.
 * @param setFlowContainer - This method is used to update the flow container when a validation error occurs, for example.
 * @param body - The form values to submit.
 * @param onRedirect - This method is used to redirect the user to a different page.
 */
export async function onSubmitRegistration(
  { flow }: OryFlowContainer,
  config: OryElementsConfiguration,
  {
    setFlowContainer,
    body,
    onRedirect,
  }: OnSubmitHandlerProps<UpdateRegistrationFlowBody>,
) {
  await config.sdk.frontend
    .updateRegistrationFlowRaw({
      flow: flow.id,
      updateRegistrationFlowBody: body,
    })
    .then(async (res) => {
      const body = await res.value()

      const didContinueWith = handleContinueWith(body.continue_with, {
        onRedirect,
      })

      // eslint-disable-next-line promise/always-return
      if (didContinueWith) {
        return
      }

      // We did not receive a valid continue_with, but the state flow is still a success. In this case we re-initialize
      // the registration flow which will redirect the user to the default url.
      onRedirect(registrationUrl(config), true)
    })
    .catch(
      handleFlowError({
        onRestartFlow: (useFlowId) => {
          if (useFlowId) {
            replaceWindowFlowId(useFlowId)
          } else {
            onRedirect(registrationUrl(config), true)
          }
        },
        onValidationError: (body: RegistrationFlow) => {
          setFlowContainer({
            flow: body,
            flowType: FlowType.Registration,
          })
        },
        onRedirect,
        config,
      }),
    )
}
