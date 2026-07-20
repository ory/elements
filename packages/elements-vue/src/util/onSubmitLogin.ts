// Copyright © 2026 Ory Corp
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
import { handleFlowError } from "./sdk-helpers"
import { replaceWindowFlowId } from "./ui"
import type { OryElementsConfiguration } from "../composables/useOryConfig"

/**
 * Submits a login flow.
 *
 * @param flow - The login flow container
 * @param config - The Ory Elements configuration
 * @param props - Submit handler props
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
