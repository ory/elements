// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  ContinueWith,
  FlowType,
  GenericError,
  handleContinueWith,
  instanceOfContinueWithRecoveryUi,
  OnRedirectHandler,
  RecoveryFlow,
  recoveryUrl,
  UpdateRecoveryFlowBody,
} from "@ory/client-fetch"
import { OnSubmitHandlerProps } from "./submitHandler"
import { RecoveryFlowContainer } from "./flowContainer"
import { frontendClient } from "./client"
import { handleFlowError } from "./sdk-helpers"
import { replaceWindowFlowId } from "./ui"
import type { OryElementsConfiguration } from "../composables/useOryConfig"

/**
 * Handles continue_with recovery UI errors.
 */
function handleContinueWithRecoveryUIError(
  error: GenericError,
  config: OryElementsConfiguration,
  onRedirect: OnRedirectHandler,
) {
  if (
    "continue_with" in error.details &&
    Array.isArray(error.details.continue_with)
  ) {
    const continueWithRecovery = (
      error.details.continue_with as ContinueWith[]
    ).find(instanceOfContinueWithRecoveryUi)
    if (continueWithRecovery?.action === "show_recovery_ui") {
      onRedirect(
        config.project.recovery_ui_url +
          "?flow=" +
          continueWithRecovery?.flow.id,
        false,
      )
      return
    }
  }
  onRedirect(recoveryUrl(config), true)
}

/**
 * Submits a recovery flow.
 *
 * @param flow - The recovery flow container
 * @param config - The Ory Elements configuration
 * @param props - Submit handler props
 */
export async function onSubmitRecovery(
  { flow }: RecoveryFlowContainer,
  config: OryElementsConfiguration,
  {
    setFlowContainer,
    body,
    onRedirect,
  }: OnSubmitHandlerProps<UpdateRecoveryFlowBody>,
) {
  if (!config.sdk.url) {
    throw new Error(
      `Please supply your Ory Network SDK url to the Ory Elements configuration.`,
    )
  }

  await frontendClient(config.sdk.url, config.sdk.options ?? {})
    .updateRecoveryFlowRaw({
      flow: flow.id,
      updateRecoveryFlowBody: body,
    })
    .then(async (res) => {
      const responseBody = await res.value()

      const didContinueWith = handleContinueWith(responseBody.continue_with, {
        onRedirect,
      })

      // eslint-disable-next-line promise/always-return
      if (!didContinueWith) {
        setFlowContainer({
          flow: responseBody,
          flowType: FlowType.Recovery,
        })
      }
    })
    .catch(
      handleFlowError({
        onRestartFlow: (useFlowId?: string) => {
          if (useFlowId) {
            replaceWindowFlowId(useFlowId)
          } else {
            onRedirect(recoveryUrl(config), true)
          }
        },
        onValidationError: (body: RecoveryFlow | { error: GenericError }) => {
          if ("error" in body) {
            handleContinueWithRecoveryUIError(body.error, config, onRedirect)
            return
          }
          setFlowContainer({
            flow: body,
            flowType: FlowType.Recovery,
          })
        },
        onRedirect,
        config,
      }),
    )
}
