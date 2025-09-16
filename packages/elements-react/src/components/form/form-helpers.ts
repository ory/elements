// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { isUiNodeInputAttributes, UiNode } from "@ory/client-fetch"
import { FormValues } from "../../types"

export function computeDefaultValues(flow: {
  active?: string
  ui: { nodes: UiNode[] }
}): FormValues {
  const defaults = flow.ui.nodes.reduce<FormValues>((acc, node) => {
    const attrs = node.attributes

    if (isUiNodeInputAttributes(attrs)) {
      // TODO: Kratos should return false for the value here, and not undefined.
      if (attrs.type === "checkbox" && typeof attrs.value === "undefined") {
        attrs.value = false
      }
      // Skip the "method" field and "submit" button
      if (
        attrs.name === "method" ||
        attrs.type === "submit" ||
        typeof attrs.value === "undefined"
      ) {
        return acc
      }

      if (attrs.name.startsWith("grant_scope")) {
        const scope = attrs.value as string
        if (Array.isArray(acc.grant_scope)) {
          return {
            ...acc,
            // We want to have all scopes accepted by default, so that the user has to actively uncheck them.
            grant_scope: [...acc.grant_scope, scope],
          }
        } else if (!acc.grant_scope) {
          return {
            ...acc,
            grant_scope: [scope],
          }
        }
        // This shouldn't happen, but just so that we don't throw an error.
        return acc
      }

      // Unroll nested traits or assign default values
      return unrollTrait(
        {
          name: attrs.name,
          value: attrs.value,
        },
        acc,
      )
    }

    return acc
  }, {})

  if (flow.active) {
    defaults.method = flow.active
  }
  return defaults
}

export function unrollTrait<T extends string, V>(
  input: { name: T; value: V },
  output: Partial<UnrollTrait<T, V>> = {},
): UnrollTrait<T, V> {
  const keys = input.name.split(".")

  // It's challenging to type this for deeply nested structures because the shape
  // of current changes dynamically as we navigate through levels.
  // TODO(jonas): This is not ideal. We should be able to type this properly.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = output
  keys.forEach((key, index) => {
    if (!key) return
    current = current[key] =
      index === keys.length - 1 ? input.value : current[key] || {}
  })

  return output as UnrollTrait<T, V>
}

type UnrollTrait<T extends string, V> = T extends `${infer Head}.${infer Tail}`
  ? { [K in Head]: UnrollTrait<Tail, V> }
  : { [K in T]: V }
