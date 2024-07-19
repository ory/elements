import { handleContinueWith } from "./continueWith"
import { FlowContainer, FlowType } from "./flowTypes"
import { frontendClient } from "./index"
import { settingsUrl } from "./urlHelpers"
import { handleFlowError, OnSubmitHandlerProps } from "./utils"

import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client-fetch"

/**
 * Use this method to submit a settings flow. This method is used in the `onSubmit` handler of the settings form.
 *
 * @param config The configuration object.
 * @param flow The flow object.
 * @param setFlowContainer This method is used to update the flow container when a validation error occurs, for example.
 * @param body The form values to submit.
 * @param onRedirect This method is used to redirect the user to a different page.
 */
export async function onSubmitSettings(
  { config, flow }: FlowContainer,
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

  const client = frontendClient(config.sdk.url, config.sdk.options ?? {})
  await client
    .updateSettingsFlowRaw({
      flow: flow.id,
      updateSettingsFlowBody: body,
    })
    .then(async (res) => {
      const body = await res.value()

      const didContinueWith = await handleContinueWith(body.continue_with, {
        onRedirect,
      })

      if (didContinueWith) {
        return
      }

      // We did not receive a valid continue_with, but the state flow is still a success. In this case we re-initialize
      // the settings flow which will redirect the user to the default url.
      onRedirect(settingsUrl(config), true)
    })
    .catch(
      handleFlowError({
        onRestartFlow: () => {
          onRedirect(settingsUrl(config), true)
        },
        onValidationError: (body: SettingsFlow) => {
          setFlowContainer({
            flow: body,
            flowType: FlowType.Settings,
          })
        },
        onRedirect,
      }),
    )
}
