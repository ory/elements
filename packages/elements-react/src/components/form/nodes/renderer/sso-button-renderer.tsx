// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { useDebounceValue } from "usehooks-ts"
import { useComponents } from "../../../../context"
import { OryNodeButtonButtonProps } from "../../../../types"
import { UiNodeInput } from "../../../../util/utilFixSDKTypesHelper"

type SsoButtonProps = {
  node: UiNodeInput
}

export function extractProvider(
  context: object | undefined,
): string | undefined {
  if (
    context &&
    typeof context === "object" &&
    "provider" in context &&
    typeof context.provider === "string"
  ) {
    return context.provider
  }
  return undefined
}

export function SSOButtonRenderer({ node }: SsoButtonProps) {
  const { Node } = useComponents()
  const attributes = node.attributes

  const {
    setValue,
    formState: { isSubmitting, isReady },
  } = useFormContext()
  // Safari cancels form submission events, if we do a state update in the same tick
  // so we delay the state update by 100ms
  const [clicked, setClicked] = useDebounceValue(false, 100)

  useEffect(() => {
    if (!isSubmitting) {
      setClicked(false)
    }
  }, [isSubmitting, setClicked])

  const clickHandler = useCallback(() => {
    setValue("provider", attributes.value)
    setValue("method", node.group)
    setClicked(true)
  }, [setValue, attributes.value, node.group, setClicked])

  const buttonProps = {
    type: "submit",
    name: attributes.name,
    value: attributes.value,
    onClick: clickHandler,
    disabled: attributes.disabled || !isReady || isSubmitting,
  } satisfies OryNodeButtonButtonProps
  const provider = extractProvider(node.meta.label?.context) ?? ""

  return (
    <Node.SsoButton
      node={node}
      attributes={attributes}
      buttonProps={buttonProps}
      provider={provider}
      isSubmitting={clicked}
    />
  )
}
