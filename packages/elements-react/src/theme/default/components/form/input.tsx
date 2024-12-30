// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, getNodeLabel } from "@ory/client-fetch"
import {
  OryNodeInputProps,
  uiTextToFormattedMessage,
  useOryFlow,
} from "@ory/elements-react"
import { useFormContext } from "react-hook-form"
import { useIntl } from "react-intl"
import { cn } from "../../utils/cn"

export const DefaultInput = ({
  node,
  attributes,
  onClick,
}: OryNodeInputProps) => {
  const label = getNodeLabel(node)
  const { register } = useFormContext()
  const {
    value,
    autocomplete,
    name,
    maxlength,
    node_type: _,
    ...rest
  } = attributes
  const intl = useIntl()
  const { flowType } = useOryFlow()

  const formattedLabel = label
    ? intl.formatMessage(
        {
          id: "input.placeholder",
          defaultMessage: "Enter your {placeholder}",
        },
        {
          placeholder: uiTextToFormattedMessage(label, intl),
        },
      )
    : ""

  return (
    <input
      {...rest}
      onClick={onClick}
      maxLength={maxlength}
      autoComplete={autocomplete}
      placeholder={formattedLabel}
      className={cn(
        "antialiased rounded-forms border leading-tight transition-colors placeholder:h-[20px] placeholder:text-input-foreground-tertiary focus-visible:outline-none focus:ring-0",
        "bg-input-background-default border-input-border-default text-input-foreground-primary",
        "disabled:bg-input-background-disabled disabled:border-input-border-disabled disabled:text-input-foreground-disabled",
        "focus:border-input-border-focus focus-visible:border-input-border-focus",
        "hover:bg-input-background-hover hover:border-input-border-hover",
        "px-4 py-[13px]",
        // The settings flow input fields are supposed to be dense, so we don't need the extra padding we want on the user flows.
        flowType === FlowType.Settings && "max-w-[488px]",
      )}
      {...register(name, { value })}
    />
  )
}
