// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { isUiNodeInputAttributes } from "@ory/client-fetch"
import { FormValues } from "../../types"
import { OryFlowContainer } from "../../util"

export function computeDefaultValues(
  flowContainer: OryFlowContainer,
): FormValues {
  return flowContainer.flow.ui.nodes.reduce<FormValues>((acc, node) => {
    if (isUiNodeInputAttributes(node.attributes)) {
      if (node.attributes.name === "method") {
        // Do not set the default values for this.
        return acc
      }

      acc[node.attributes.name] = node.attributes.value ?? ""
    }

    return acc
  }, {})
}
