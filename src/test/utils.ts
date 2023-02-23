// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from "@ory/client"
import { isUiNodeInputAttributes } from "@ory/integrations/ui"
import { Traits } from "./models/types"

export const isUiNode = (a: unknown): a is UiNode[] => {
  return (
    Array.isArray(a) &&
    a.some((v) => typeof v === "object" && v !== null && "attributes" in v)
  )
}

export const inputNodesToRecord = (nodes: UiNode[]): Record<string, Traits> => {
  return nodes.reduce((map: Record<string, Traits>, { attributes }) => {
    if (isUiNodeInputAttributes(attributes)) {
      map[attributes.name] = {
        value: attributes.value,
        type: attributes.type as Traits["type"],
        label: attributes.label?.text || "",
      }
    }
    return map
  }, {})
}

export const RandomString = (length = 20) => {
  return Array(length)
    .fill(null)
    .map(() => Math.random().toString(36).substring(2))
    .join("")
}
