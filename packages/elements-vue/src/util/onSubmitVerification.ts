// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  VerificationFlow,
  verificationUrl,
  UpdateVerificationFlowBody,
  handleContinueWith,
} from "@ory/client-fetch"
import { OnSubmitHandlerProps } from "./submitHandler"
import { OryFlowContainer } from "./flowContainer"
import { frontendClient } from "./client"
import { handleFlowError } from "./sdk-helpers"
import { replaceWindowFlowId } from "./ui"
import type { OryElementsConfiguration } from "../composables/useOryConfig"

/**
 * Submits a verification flow.
 *
 * @param flow - The verification flow container
 * @param config - The Ory Elements configuration
 * @param props - Submit handler props
 */
export async function onSubmitVerification(
  { flow }: OryFlowContainer,
  config: OryElementsConfiguration,
  {
    setFlowContainer,
    body,
    onRedirect,
  }: OnSubmitHandlerProps<UpdateVerificationFlowBody>,
) {
  if (!config.sdk.url) {
    throw new Error(
      `Please supply your Ory Network SDK url to the Ory Elements configuration.`,
    )
  }

  await frontendClient(config.sdk.url, config.sdk.options ?? {})
    .updateVerificationFlowRaw({
      flow: flow.id,
      updateVerificationFlowBody: body,
    })
    .then(async (res) => {
      const responseBody = await res.value()

      // Handle continue_with actions (e.g., redirect after verification)
      // The API may return continue_with even if not typed in VerificationFlow
      const continueWith = (
        responseBody as {
          continue_with?: Parameters<typeof handleContinueWith>[0]
        }
      ).continue_with
      const didContinueWith = handleContinueWith(continueWith, {
        onRedirect,
      })

      // eslint-disable-next-line promise/always-return
      if (!didContinueWith) {
        // No continue_with action, just update the flow container
        setFlowContainer({
          flow: responseBody,
          flowType: FlowType.Verification,
        })
      }
    })
    .catch(
      handleFlowError({
        onRestartFlow: (useFlowId?: string) => {
          if (useFlowId) {
            replaceWindowFlowId(useFlowId)
          } else {
            onRedirect(verificationUrl(config), true)
          }
        },
        onValidationError: (body: VerificationFlow) => {
          setFlowContainer({
            flow: body,
            flowType: FlowType.Verification,
          })
        },
        onRedirect,
        config,
      }),
    )
}
