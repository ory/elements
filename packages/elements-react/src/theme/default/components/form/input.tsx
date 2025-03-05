// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, getNodeLabel } from "@ory/client-fetch"
import {
  OryNodeInputProps,
  uiTextToFormattedMessage,
  useOryFlow,
} from "@ory/elements-react"
import { useRef, useState } from "react"
import { useFormContext } from "react-hook-form"
import { useIntl } from "react-intl"
import EyeOff from "../../assets/icons/eye-off.svg"
import Eye from "../../assets/icons/eye.svg"
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
  const inputRef = useRef<HTMLInputElement | null>(null)

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

  if (rest.type === "hidden") {
    return (
      <input
        {...rest}
        onClick={onClick}
        maxLength={maxlength}
        autoComplete={autocomplete}
        placeholder={formattedLabel}
        data-testid={`ory/form/node/input/${name}`}
        {...register(name, { value })}
      />
    )
  }

  const { ref, ...restRegister } = register(name, { value })

  return (
    <div className="relative flex justify-stretch">
      <input
        {...rest}
        onClick={onClick}
        maxLength={maxlength}
        autoComplete={autocomplete}
        placeholder={formattedLabel}
        data-testid={`ory/form/node/input/${name}`}
        className={cn(
          "antialiased rounded-forms border leading-tight transition-colors placeholder:h-[20px] placeholder:text-input-foreground-tertiary focus-visible:outline-none focus:ring-0 w-full",
          "bg-input-background-default border-input-border-default text-input-foreground-primary",
          "disabled:bg-input-background-disabled disabled:border-input-border-disabled disabled:text-input-foreground-disabled",
          "focus:border-input-border-focus focus-visible:border-input-border-focus",
          "hover:bg-input-background-hover hover:border-input-border-hover",
          "px-4 py-[13px]",
          // The settings flow input fields are supposed to be dense, so we don't need the extra padding we want on the user flows.
          flowType === FlowType.Settings && "max-w-[488px]",
        )}
        ref={(e) => {
          inputRef.current = e
          ref(e)
        }}
        {...restRegister}
      />
      {rest.type === "password" && <PasswordToggle inputRef={inputRef} />}
    </div>
  )
}

function PasswordToggle({
  inputRef,
}: {
  inputRef: React.RefObject<HTMLInputElement>
}) {
  const [shown, setShown] = useState(false)

  const handleClick = () => {
    setShown(!shown)
    if (inputRef.current) {
      inputRef.current.type = shown ? "password" : "text"
    }
  }

  return (
    <button
      onClick={handleClick}
      className="absolute right-0 h-full w-12 flex items-center justify-center"
      type="button"
    >
      {shown ? <EyeOff /> : <Eye />}
    </button>
  )
}
