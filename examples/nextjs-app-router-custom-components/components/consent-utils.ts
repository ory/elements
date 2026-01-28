// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode, UiNodeInputAttributesTypeEnum } from "@ory/client-fetch"
import { isUiNodeInput, UiNodeInput } from "@ory/elements-react"

/**
 * Finds consent-specific nodes from the UI nodes list.
 */
export function findConsentNodes(nodes: UiNode[]) {
  let rememberNode: UiNodeInput | undefined
  const submitNodes: UiNodeInput[] = []

  for (const node of nodes) {
    if (!isUiNodeInput(node)) {
      continue
    }

    if (node.attributes.name === "remember") {
      rememberNode = node
    } else if (node.attributes.type === UiNodeInputAttributesTypeEnum.Submit) {
      submitNodes.push(node)
    }
  }

  return { rememberNode, submitNodes }
}
