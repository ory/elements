// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  handleContinueWith,
  LoginFlow,
  loginUrl,
  UpdateLoginFlowBody,
} from "@ory/client-fetch"
import { OnSubmitHandlerProps } from "./submitHandler"
import { LoginFlowContainer } from "./flowContainer"
import { frontendClient } from "./client"
import { replaceWindowFlowId } from "./internal"
import { OryElementsConfiguration } from "../context"
import { handleFlowError } from "./sdk-helpers"

/**
 * Use this method to submit a login flow. This method is used in the `onSubmit` handler of the login form.
 *
 * @param config - The configuration object.
 * @param flow - The flow object.
 * @param setFlowContainer - This method is used to update the flow container when a validation error occurs, for example.
 * @param body - The form values to submit.
 * @param onRedirect - This method is used to redirect the user to a different page.
 */
export async function onSubmitLogin(
  { flow }: LoginFlowContainer,
  config: OryElementsConfiguration,
  {
    setFlowContainer,
    body,
    onRedirect,
  }: OnSubmitHandlerProps<UpdateLoginFlowBody>,
) {
  if (!config.sdk.url) {
    throw new Error(
      `Please supply your Ory Network SDK url to the Ory Elements configuration.`,
    )
  }

  await frontendClient(config.sdk.url, config.sdk.options ?? {})
    .updateLoginFlowRaw({
      flow: flow.id,
      updateLoginFlowBody: body,
    })
    .then(async (res) => {
      const body = await res.value()

      const didContinueWith = handleContinueWith(body.continue_with, {
        onRedirect,
      })

      if (!didContinueWith) {
        // We did not receive a valid continue_with, but the state flow is still a success. In this case we re-initialize
        // the registration flow which will redirect the user to the default url.
        onRedirect(loginUrl(config), true)
      }

      return
    })
    .catch(
      handleFlowError({
        onRestartFlow: (useFlowId?: string) => {
          if (useFlowId) {
            replaceWindowFlowId(useFlowId)
          } else {
            onRedirect(loginUrl(config), true)
          }
        },
        onValidationError: (body: LoginFlow) => {
          setFlowContainer({
            flow: body,
            flowType: FlowType.Login,
          })
        },
        onRedirect,
        config,
      }),
    )
}
