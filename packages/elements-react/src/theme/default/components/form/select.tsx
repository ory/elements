// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType } from "@ory/client-fetch"
import { OryNodeSelectProps, useOryFlow } from "@ory/elements-react"
import { ComponentPropsWithRef, forwardRef } from "react"
import { useIntl } from "react-intl"
import { resolveOptionLabel } from "../../../../util/nodes"
import { cn } from "../../utils/cn"

function ChevronDown() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-input-foreground-primary"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const defaultSelectClassName = cn(
  "w-full appearance-none rounded-forms border leading-tight antialiased transition-colors focus:ring-0 focus-visible:outline-none",
  "border-input-border-default bg-input-background-default text-input-foreground-primary",
  "focus-within:border-input-border-focus focus-visible:border-input-border-focus",
  "hover:border-input-border-hover hover:bg-input-background-hover",
  "px-4 py-[13px] pr-10",
  "disabled:border-input-border-disabled disabled:bg-input-background-disabled disabled:text-input-foreground-disabled",
)

type SelectElementProps = ComponentPropsWithRef<"select">

const TextSelect = forwardRef<HTMLSelectElement, SelectElementProps>(
  ({ className, children, ...props }, ref) => {
    const { flowType } = useOryFlow()
    return (
      <div className="relative w-full">
        <select
          {...props}
          ref={ref}
          className={cn(
            defaultSelectClassName,
            flowType === FlowType.Settings && "max-w-[488px]",
            className,
          )}
        >
          {children}
        </select>
        <ChevronDown />
      </div>
    )
  },
)
TextSelect.displayName = "TextSelect"

function DefaultSelectRoot({
  attributes,
  inputProps,
  options,
}: OryNodeSelectProps) {
  const intl = useIntl()

  // `value` on a native <select> must be a string. react-hook-form passes
  // through whatever the current form state holds, so coerce to a string and
  // avoid passing a React `undefined` controlled/uncontrolled mix.
  const value =
    inputProps.value === undefined || inputProps.value === null
      ? ""
      : String(inputProps.value)

  // For required fields the empty option is a placeholder only — disabling
  // and hiding it forces the user to pick a real value. For optional fields
  // we leave the empty option selectable so the user can clear their choice
  // again after picking one.
  const required = attributes.required ?? false

  return (
    <TextSelect
      data-testid={`ory/form/node/input/${inputProps.name}`}
      id={inputProps.id}
      name={inputProps.name}
      disabled={inputProps.disabled}
      onBlur={inputProps.onBlur}
      onChange={inputProps.onChange}
      ref={inputProps.ref}
      value={value}
      required={required}
    >
      <option value="" disabled={required} hidden={required}>
        {inputProps.placeholder}
      </option>
      {options.map((option, index) => {
        const optionValue = String(option.value)
        return (
          <option key={`${optionValue}-${index}`} value={optionValue}>
            {resolveOptionLabel(inputProps.name, option.value, intl)}
          </option>
        )
      })}
    </TextSelect>
  )
}

export const DefaultSelect = Object.assign(DefaultSelectRoot, {
  TextSelect,
})
