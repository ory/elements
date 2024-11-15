// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { isUiNodeInputAttributes, UiNode } from "@ory/client-fetch"
import { FormValues } from "../../types"

export function computeDefaultValues(nodes: UiNode[]): FormValues {
  return nodes.reduce<FormValues>((acc, node) => {
    const attrs = node.attributes

    if (isUiNodeInputAttributes(attrs)) {
      // Skip the "method" field and "submit" button
      if (attrs.name === "method" || attrs.type === "submit") return acc

      // Unroll nested traits or assign default values
      const unrolled = unrollTrait({
        name: attrs.name,
        value: attrs.value ?? "",
      })
      Object.assign(acc, unrolled ?? { [attrs.name]: attrs.value ?? "" })
    }

    return acc
  }, {})
}

export function unrollTrait<T extends string, V>(
  input: { name: T; value: V },
  output: Partial<UnrollTrait<T, V>> = {},
): UnrollTrait<T, V> | undefined {
  const keys = input.name.split(".")
  if (!keys.length) return undefined

  // It's challenging to type this for deeply nested structures because the shape
  // of current changes dynamically as we navigate through levels.
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
