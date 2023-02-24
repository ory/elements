// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode, UiNodeAttributes, UiNodeMeta } from "@ory/client"
import { isUiNodeInputAttributes } from "@ory/integrations/ui"
import { Traits } from "./models/types"

export const isUiNode = (a: unknown): a is UiNode[] => {
  return (
    Array.isArray(a) &&
    a.some((v) => typeof v === "object" && v !== null && "attributes" in v)
  )
}

export const inputNodesToRecord = (nodes: UiNode[]): Record<string, Traits> => {
  return nodes.reduce((map: Record<string, Traits>, { group, attributes }) => {
    if (isUiNodeInputAttributes(attributes)) {
      map[attributes.name] = {
        group: group,
        node_type: attributes.node_type,
        required: attributes.required,
        value: attributes.value,
        type: attributes.type as Traits["type"],
        label: attributes.label?.text || "",
      }
    }
    return map
  }, {})
}

export const traitsToNodes = (
  traits: Record<string, Traits>,
  includeCsrf?: boolean,
): UiNode[] => {
  const nodes = Object.entries(traits).map<UiNode>(
    ([name, { group, label, type, value, node_type, required }]) => {
      return {
        group: group,
        messages: [],
        type: "input",
        meta: {
          label: {
            id: Math.floor(Math.random() * 6) + 1,
            text: label || name,
            type: "info",
          },
        } as UiNodeMeta,
        attributes: {
          name,
          value,
          type,
          node_type: node_type || "input",
          required: required || false,
        } as UiNodeAttributes,
      }
    },
  )

  includeCsrf &&
    nodes.push({
      group: "default",
      type: "input",
      attributes: {
        name: "csrf_token",
        value: RandomString(20),
        type: "hidden",
        node_type: "input",
        disabled: false,
        required: true,
      },
      meta: {},
      messages: [],
    } as UiNode)

  return nodes
}

export const RandomString = (length = 20) => {
  return Array(length)
    .fill(null)
    .map(() => Math.random().toString(36).substring(2))
    .join("")
}
