// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode, UiNodeAttributes, UiNodeMeta } from "@ory/client"
import { isUiNodeInputAttributes } from "@ory/integrations/ui"
import { Traits } from "./types"

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
        value: attributes.value as string,
        type: attributes.type as Traits["type"],
        label: attributes.label?.text ?? "",
        name: attributes.name,
      }
    }
    return map
  }, {})
}

export const traitsToNodes = (
  traits: Record<string, Traits>,
  includeCsrf?: boolean,
  includeValue = true,
): UiNode[] => {
  const nodes = Object.entries(traits).map<UiNode>(
    ([key, { group, label, type, value, node_type, required, name }]) => {
      return {
        group: group,
        messages: [],
        type: "input",
        meta: {
          label: {
            id: Math.floor(Math.random() * 6) + 1,
            text: label ?? name ?? key,
            type: "info",
          },
        } as UiNodeMeta,
        attributes: {
          name: name ?? key,
          ...(includeValue && { value: value }),
          type,
          node_type: node_type ?? "input",
          required: required ?? false,
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
  return Array(Math.ceil(length * 0.1))
    .fill(null)
    .map(() => Math.random().toString(36).substring(2))
    .join("")
    .substring(0, length)
}

export const UUIDv4 = () => `22b3ad6f-c50a-4c2f-8c94-${RandomString(12)}`

export const RandomEmail = () => `${RandomString(4)}@${RandomString(4)}.com`
export const RandomPassword = () => RandomString(10)
