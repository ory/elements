// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { getNodeLabel } from "@ory/client-fetch"
import { useFormState } from "react-hook-form"
import { useIntl } from "react-intl"
import { useComponents } from "../../../../context"
import { resolvePlaceholder } from "../../../../util"
import {
  UiNodeInput,
  UiNodeInputAttributesOption,
} from "../../../../util/utilFixSDKTypesHelper"
import { useInputProps } from "../hooks/useInputProps"

type SelectRendererProps = {
  node: UiNodeInput
}

export function SelectRenderer({ node }: SelectRendererProps) {
  const { Node } = useComponents()
  const label = getNodeLabel(node)
  const intl = useIntl()
  const formState = useFormState()

  const attributes = node.attributes
  const placeholder = label ? resolvePlaceholder(label, intl) : ""
  const inputProps = useInputProps(attributes, placeholder)
  const options: UiNodeInputAttributesOption[] = attributes.options ?? []

  // Defensive: callers reach SelectRenderer only when input.tsx has already
  // verified Node.Select is wired up, but assert here so a misconfigured
  // component set fails loudly instead of crashing inside React.
  if (!Node.Select) {
    throw new Error(
      "[Ory/Elements React] SelectRenderer was reached without a Node.Select " +
        "component. Provide one via OryProvider's `components` prop or call " +
        "`getOryComponents()` to inherit the default.",
    )
  }

  return (
    <Node.Label
      attributes={attributes}
      node={node}
      fieldError={formState.errors[attributes.name]}
    >
      <Node.Select
        attributes={attributes}
        node={node}
        inputProps={inputProps}
        options={options}
      />
    </Node.Label>
  )
}
