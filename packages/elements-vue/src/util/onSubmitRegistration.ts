// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  handleContinueWith,
  RegistrationFlow,
  registrationUrl,
  UpdateRegistrationFlowBody,
} from "@ory/client-fetch"
import { OnSubmitHandlerProps } from "./submitHandler"
import { RegistrationFlowContainer } from "./flowContainer"
import { frontendClient } from "./client"
import { handleFlowError } from "./sdk-helpers"
import { replaceWindowFlowId } from "./ui"
import type { OryElementsConfiguration } from "../composables/useOryConfig"

/**
 * Submits a registration flow.
 *
 * @param flow - The registration flow container
 * @param config - The Ory Elements configuration
 * @param props - Submit handler props
 */
export async function onSubmitRegistration(
  { flow }: RegistrationFlowContainer,
  config: OryElementsConfiguration,
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

  await frontendClient(config.sdk.url, config.sdk.options ?? {})
    .updateRegistrationFlowRaw({
      flow: flow.id,
      updateRegistrationFlowBody: body,
    })
    .then(async (res) => {
      const body = await res.value()

      const didContinueWith = handleContinueWith(body.continue_with, {
        onRedirect,
      })

      if (!didContinueWith) {
        onRedirect(registrationUrl(config), true)
      }

      return
    })
    .catch(
      handleFlowError({
        onRestartFlow: (useFlowId?: string) => {
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
