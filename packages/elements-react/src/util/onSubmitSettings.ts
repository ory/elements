// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  handleContinueWith,
  isResponseError,
  loginUrl,
  SettingsFlow,
  settingsUrl,
  UpdateSettingsFlowBody,
} from "@ory/client-fetch"
import { OryElementsConfiguration } from "../context"
import { OryFlowContainer } from "./flowContainer"
import { replaceWindowFlowId } from "./internal"
import { OnSubmitHandlerProps } from "./submitHandler"
import { handleFlowError } from "./sdk-helpers"

/**
 * Use this method to submit a settings flow. This method is used in the `onSubmit` handler of the settings form.
 *
 * @param config - The configuration object.
 * @param flow - The flow object.
 * @param setFlowContainer - This method is used to update the flow container when a validation error occurs, for example.
 * @param body - The form values to submit.
 * @param onRedirect - This method is used to redirect the user to a different page.
 */
export async function onSubmitSettings(
  { flow }: OryFlowContainer,
  config: OryElementsConfiguration,
  {
    setFlowContainer,
    body,
    onRedirect,
  }: OnSubmitHandlerProps<UpdateSettingsFlowBody>,
) {
  await config.sdk.frontend
    .updateSettingsFlowRaw({
      flow: flow.id,
      updateSettingsFlowBody: body,
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

      setFlowContainer({
        flow: body,
        flowType: FlowType.Settings,
      })
    })
    .catch(
      handleFlowError({
        onRestartFlow: (useFlowId) => {
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
    .catch((err) => {
      if (isResponseError(err)) {
        if (err.response.status === 401) {
          return onRedirect(
            loginUrl(config) + "?return_to=" + settingsUrl(config),
            true,
          )
        }
        throw err
      }
    })
}
