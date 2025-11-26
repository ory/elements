// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType } from "@ory/client-fetch"
import { OryNodeInputProps, useOryFlow } from "@ory/elements-react"
import * as PasswordToggleField from "@radix-ui/react-password-toggle-field"
import { ComponentProps, ComponentPropsWithRef, forwardRef } from "react"
import EyeOff from "../../assets/icons/eye-off.svg"
import Eye from "../../assets/icons/eye.svg"
import { cn } from "../../utils/cn"

const defaultInputClassName = cn(
  "w-full rounded-forms border leading-tight antialiased transition-colors focus:ring-0 focus-visible:outline-none",
  "border-input-border-default bg-input-background-default text-input-foreground-primary",
  "focus-within:border-input-border-focus focus-visible:border-input-border-focus",
  "hover:bg-input-background-hover",
)

function isAutocompletePassword(
  autocomplete: string | undefined,
): autocomplete is "new-password" | "current-password" {
  return autocomplete === "new-password" || autocomplete === "current-password"
}

function PasswordInput({
  className,
  ...rest
}: ComponentProps<typeof PasswordToggleField.Input>) {
  return (
    <PasswordToggleField.Root>
      <div
        className={cn(
          defaultInputClassName,
          "flex justify-stretch not-focus-within:hover:border-input-border-hover",
          "data-[disabled=true]:border-input-border-disabled data-[disabled=true]:bg-input-background-disabled data-[disabled=true]:text-input-foreground-disabled",
        )}
        data-disabled={rest.disabled}
      >
        <PasswordToggleField.Input
          {...rest}
          className={cn(
            "w-full rounded-l-forms rounded-r-none bg-transparent px-4 py-[13px] text-input-foreground-primary placeholder:h-[20px] placeholder:text-input-foreground-tertiary focus:outline-none disabled:bg-input-background-disabled disabled:text-input-foreground-disabled",
            className,
          )}
        ></PasswordToggleField.Input>
        <PasswordToggleField.Toggle className="cursor-pointer bg-transparent px-2 py-[13px]">
          <PasswordToggleField.Icon visible={<EyeOff />} hidden={<Eye />} />
        </PasswordToggleField.Toggle>
      </div>
    </PasswordToggleField.Root>
  )
}

type InputProps = ComponentPropsWithRef<"input">

export const TextInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const { flowType } = useOryFlow()
    return (
      <input
        {...props}
        className={cn(
          defaultInputClassName,
          "px-4 py-[13px] hover:border-input-border-hover",
          "placeholder:h-[20px] placeholder:text-input-foreground-tertiary disabled:border-input-border-disabled disabled:bg-input-background-disabled disabled:text-input-foreground-disabled",
          // The settings flow input fields are supposed to be dense, so we don't need the extra padding we want on the user flows.
          flowType === FlowType.Settings && "max-w-[488px]",
          className,
        )}
        ref={ref}
      />
    )
  },
)

const DefaultInputRoot = ({ inputProps }: OryNodeInputProps) => {
  if (inputProps.type === "password") {
    // Typescript doesn't narrow the type correctly here, so we need to do an explicit check
    const autoComplete = isAutocompletePassword(inputProps.autoComplete)
      ? inputProps.autoComplete
      : undefined

    return (
      <PasswordInput
        data-testid={`ory/form/node/input/${inputProps.name}`}
        {...inputProps}
        autoComplete={autoComplete}
      />
    )
  }

  if (inputProps.type === "hidden") {
    return (
      <input
        data-testid={`ory/form/node/input/${inputProps.name}`}
        {...inputProps}
      />
    )
  }

  return (
    <TextInput
      data-testid={`ory/form/node/input/${inputProps.name}`}
      {...inputProps}
    />
  )
}

export const DefaultInput = Object.assign(DefaultInputRoot, {
  TextInput,
  PasswordInput,
})
