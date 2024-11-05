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
  const { value, autocomplete, name, maxlength, ...rest } = attributes
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
        "antialiased disabled:text-forms-fg-disabled disabled:bg-forms-bg-disabled bg-forms-bg-default rounded-border-radius-forms border border-forms-border-default leading-tight hover:border-forms-border-hover transition-colors text-sm",
        "px-3 py-2.5",
        // The settings flow input fields are supposed to be dense, so we don't need the extra padding we want on the user flows.
        flowType === FlowType.Settings ? "max-w-[488px]" : "md:px-4 md:py-4",
      )}
      {...register(name, { value })}
    />
  )
}
