// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType } from "@ory/client-fetch"
import { OryNodeInputProps, useOryFlow } from "@ory/elements-react"
import * as PasswordToggleField from "@radix-ui/react-password-toggle-field"
import {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  forwardRef,
} from "react"
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

const PasswordInput = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<typeof PasswordToggleField.Input> & {
    "data-node-disabled"?: boolean
  }
>(({ className, ...rest }, ref) => (
  <PasswordToggleField.Root>
    <div
      className={cn(
        defaultInputClassName,
        "flex justify-stretch not-focus-within:hover:border-input-border-hover",
        "locked:border-input-border-disabled locked:bg-input-background-disabled locked:text-input-foreground-disabled busy:animate-busy-dim",
      )}
      data-disabled={rest.disabled}
      data-node-disabled={rest["data-node-disabled"]}
    >
      <PasswordToggleField.Input
        {...rest}
        ref={ref}
        className={cn(
          "w-full rounded-l-forms rounded-r-none bg-transparent px-4 py-[13px] text-input-foreground-primary placeholder:h-[20px] placeholder:text-input-foreground-tertiary focus:outline-none locked:bg-input-background-disabled locked:text-input-foreground-disabled",
          className,
        )}
      ></PasswordToggleField.Input>
      <PasswordToggleField.Toggle
        id={undefined}
        className="cursor-pointer bg-transparent px-2 py-[13px]"
      >
        <PasswordToggleField.Icon visible={<EyeOff />} hidden={<Eye />} />
      </PasswordToggleField.Toggle>
    </div>
  </PasswordToggleField.Root>
))

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
          "placeholder:h-[20px] placeholder:text-input-foreground-tertiary locked:border-input-border-disabled locked:bg-input-background-disabled locked:text-input-foreground-disabled busy:animate-busy-dim",
          // The settings flow input fields are supposed to be dense, so we don't need the extra padding we want on the user flows.
          flowType === FlowType.Settings && "max-w-[488px]",
          className,
        )}
        ref={ref}
      />
    )
  },
)

const DefaultInputRoot = ({ inputProps, node }: OryNodeInputProps) => {
  if (inputProps.type === "password") {
    // Typescript doesn't narrow the type correctly here, so we need to do an explicit check
    const autoComplete = isAutocompletePassword(inputProps.autoComplete)
      ? inputProps.autoComplete
      : undefined

    return (
      <PasswordInput
        data-testid={`ory/form/node/input/${inputProps.name}`}
        data-node-disabled={node.attributes.disabled || undefined}
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
      data-node-disabled={node.attributes.disabled || undefined}
      {...inputProps}
    />
  )
}

export const DefaultInput = Object.assign(DefaultInputRoot, {
  TextInput,
  PasswordInput,
})
