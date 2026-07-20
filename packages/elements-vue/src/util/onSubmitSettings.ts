// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  handleContinueWith,
  SettingsFlow,
  settingsUrl,
  UpdateSettingsFlowBody,
} from "@ory/client-fetch"
import { OnSubmitHandlerProps } from "./submitHandler"
import { SettingsFlowContainer } from "./flowContainer"
import { frontendClient } from "./client"
import { handleFlowError } from "./sdk-helpers"
import { replaceWindowFlowId } from "./ui"
import type { OryElementsConfiguration } from "../composables/useOryConfig"

/**
 * Submits a settings flow.
 *
 * @param flow - The settings flow container
 * @param config - The Ory Elements configuration
 * @param props - Submit handler props
 */
export async function onSubmitSettings(
  { flow }: SettingsFlowContainer,
  config: OryElementsConfiguration,
  {
    setFlowContainer,
    body,
    onRedirect,
  }: OnSubmitHandlerProps<UpdateSettingsFlowBody>,
) {
  if (!config.sdk.url) {
    throw new Error(
      `Please supply your Ory Network SDK url to the Ory Elements configuration.`,
    )
  }

  await frontendClient(config.sdk.url, config.sdk.options ?? {})
    .updateSettingsFlowRaw({
      flow: flow.id,
      updateSettingsFlowBody: body,
    })
    .then(async (res) => {
      const body = await res.value()

      // Update the flow container with the new flow state
      setFlowContainer({
        flow: body,
        flowType: FlowType.Settings,
      })

      handleContinueWith(body.continue_with, {
        onRedirect,
      })

      return
    })
    .catch(
      handleFlowError({
        onRestartFlow: (useFlowId?: string) => {
          if (useFlowId) {
            replaceWindowFlowId(useFlowId)
          } else {
            onRedirect(settingsUrl(config), true)
          }
        },
        onValidationError: (body: SettingsFlow) => {
          setFlowContainer({
            flow: body,
            flowType: FlowType.Settings,
          })
        },
        onRedirect,
        config,
      }),
    )
}
