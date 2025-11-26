// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useController } from "react-hook-form"
import { useComponents } from "../../../../context"
import { OryNodeCheckboxInputProps } from "../../../../types"
import { UiNodeInput } from "../../../../util/utilFixSDKTypesHelper"

type CheckboxRendererProps = {
  node: UiNodeInput
}

export function CheckboxRenderer({ node }: CheckboxRendererProps) {
  const attributes = node.attributes
  const { Node } = useComponents()
  const controller = useController({
    name: attributes.name,
    defaultValue: attributes.value,
    disabled: attributes.disabled,
  })

  const inputProps = {
    ...controller.field,
    type: "checkbox" as const,
    value: controller.field.value === true ? "true" : "false",
    checked: controller.field.value === true,
    disabled: attributes.disabled || !controller.formState.isReady,
  } satisfies OryNodeCheckboxInputProps

  return (
    <Node.Label
      // The label is rendered in the checkbox component
      attributes={{ ...attributes, label: undefined }}
      node={{ ...node, meta: { ...node.meta, label: undefined } }}
      fieldError={controller.fieldState.error}
    >
      <Node.Checkbox
        attributes={attributes}
        node={node}
        inputProps={inputProps}
        onClick={() => {}}
      />
    </Node.Label>
  )
}
