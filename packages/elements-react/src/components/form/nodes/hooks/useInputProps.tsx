// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNodeInputAttributes } from "@ory/client-fetch"
import { MouseEventHandler } from "react"
import { useController } from "react-hook-form"
import { triggerToWindowCall } from "../../../../util/ui"
import { OryNodeInputInputProps } from "../../../../types"
import { useOryFlow } from "../../../../context"
import { useAutofocus } from "../../../../context/autofocus-context"

export function useInputProps(
  attributes: UiNodeInputAttributes,
  placeholder?: string,
): OryNodeInputInputProps {
  const {
    formState: { isSubmitting },
  } = useOryFlow()
  const { claimAutofocus } = useAutofocus()
  const controller = useController({
    name: attributes.name,
    control: undefined,
    disabled: attributes.disabled,
    shouldUnregister: true,
    // TODO: consider adding rules based on attributes.required, attributes.pattern, etc.
  })
  const handleClick: MouseEventHandler = () => {
    if (attributes.onclickTrigger) {
      triggerToWindowCall(attributes.onclickTrigger)
    }
  }

  const isDisabled =
    attributes.disabled || !controller.formState.isReady || isSubmitting
  const isHidden = attributes.type === "hidden"

  // Only focusable, visible inputs can claim autofocus
  const shouldAutofocus = !isDisabled && !isHidden && claimAutofocus()

  return {
    ...controller.field,
    type: attributes.type,
    onClick: handleClick,
    maxLength: attributes.maxlength,
    autoComplete: attributes.autocomplete,
    placeholder: placeholder || "",
    disabled: isDisabled,
    autoFocus: shouldAutofocus,
  }
}
