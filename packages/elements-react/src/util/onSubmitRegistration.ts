// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  handleContinueWith,
  handleFlowError,
  RegistrationFlow,
  registrationUrl,
  UpdateRegistrationFlowBody,
} from "@ory/client-fetch"
import { OryFlowContainer } from "./flowContainer"
import { OnSubmitHandlerProps } from "./submitHandler"
import { frontendClient } from "./client"

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
  { config, flow }: OryFlowContainer,
  {
    setFlowContainer,
    body,
    onRedirect,
  }: OnSubmitHandlerProps<UpdateRegistrationFlowBody>,
) {
  if (!config.sdk.url) {
    throw new Error(
      `Please supply your Ory Network SDK url to the Ory Elements configuration.`,
    )
  }

  const client = frontendClient(config.sdk.url, config.sdk.options ?? {})
  await client
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
        onRestartFlow: () => {
          onRedirect(registrationUrl(config), true)
        },
        onValidationError: (body: RegistrationFlow) => {
          setFlowContainer({
            flow: body,
            flowType: FlowType.Registration,
            config,
          })
        },
        onRedirect,
      }),
    )
}
