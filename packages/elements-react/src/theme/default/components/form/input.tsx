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
import { omitInputAttributes } from "../../../../util/omitAttributes"

export const defaultInputClassName = cn(
  "w-full rounded-forms border leading-tight antialiased transition-colors placeholder:h-[20px] placeholder:text-input-foreground-tertiary focus:ring-0 focus-visible:outline-hidden",
  "border-input-border-default bg-input-background-default text-input-foreground-primary",
  "disabled:border-input-border-disabled disabled:bg-input-background-disabled disabled:text-input-foreground-disabled",
  "focus:border-input-border-focus focus-visible:border-input-border-focus",
  "hover:border-input-border-hover hover:bg-input-background-hover",
  "px-4 py-[13px]",
)

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
        {...omitInputAttributes(rest)}
        data-testid={`ory/form/node/input/${name}`}
        {...register(name, { value })}
      />
    )
  }

  const { ref, ...restRegister } = register(name, { value })

  return (
    <div
      className={cn(
        "relative flex justify-stretch",
        // The settings flow input fields are supposed to be dense, so we don't need the extra padding we want on the user flows.
        flowType === FlowType.Settings && "max-w-[488px]",
      )}
    >
      <input
        {...omitInputAttributes(rest)}
        onClick={onClick}
        maxLength={maxlength}
        autoComplete={autocomplete}
        placeholder={formattedLabel}
        data-testid={`ory/form/node/input/${name}`}
        className={defaultInputClassName}
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
      className="absolute right-0 flex h-full w-12 items-center justify-center text-input-foreground-primary"
      type="button"
      aria-label="Toggle password visibility"
    >
      {shown ? <EyeOff /> : <Eye />}
    </button>
  )
}
