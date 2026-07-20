// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { computed } from "vue"
import { UiNode, isUiNodeInputAttributes } from "@ory/client-fetch"
import { useOryFlow } from "./useOryFlow"
import { useOptionalOryFormContext } from "./useOryFormContext"

/**
 * Find the resend code node from flow nodes.
 */
function findResendNode(nodes: UiNode[]): UiNode | undefined {
  return nodes.find(
    (n) =>
      isUiNodeInputAttributes(n.attributes) &&
      ((["email", "recovery_confirm_address"].includes(n.attributes.name) &&
        n.attributes.type === "submit") ||
        n.attributes.name === "resend"),
  )
}

/**
 * Composable for resending verification/login codes.
 *
 * Provides a callback to trigger a code resend in the current flow.
 * If the current flow does not support code resending, `resendCodeNode` will be `undefined`.
 */
export function useResendCode() {
  const { flowContainer } = useOryFlow()
  const formContext = useOptionalOryFormContext()

  const resendCodeNode = computed(() =>
    findResendNode(flowContainer.value.flow.ui.nodes),
  )

  const resendCode = () => {
    if (!formContext || !resendCodeNode.value) return

    const node = resendCodeNode.value
    if (!isUiNodeInputAttributes(node.attributes)) return

    // Get hidden fields
    const hiddenNodes = flowContainer.value.flow.ui.nodes.filter(
      (n) =>
        isUiNodeInputAttributes(n.attributes) &&
        (n.attributes.type === "hidden" || n.group === "default"),
    )

    // Set hidden values
    for (const hiddenNode of hiddenNodes) {
      if (isUiNodeInputAttributes(hiddenNode.attributes)) {
        const { name, value } = hiddenNode.attributes
        if (value !== undefined) {
          formContext.setValue(name, String(value))
        }
      }
    }

    // Clear code and set resend values
    formContext.setValue("code", undefined)
    formContext.setValue(node.attributes.name, String(node.attributes.value))
    formContext.setValue("method", "code")

    // Submit the form
    void formContext.handleSubmit()
  }

  return {
    resendCode,
    resendCodeNode,
  }
}
