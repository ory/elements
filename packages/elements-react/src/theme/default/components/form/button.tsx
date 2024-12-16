// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, getNodeLabel } from "@ory/client-fetch"
import {
  OryNodeButtonProps,
  uiTextToFormattedMessage,
} from "@ory/elements-react"
import { useFormContext } from "react-hook-form"
import { useIntl } from "react-intl"
import { Spinner } from "./spinner"
import { useOryFlow } from "@ory/elements-react"
import { cva, VariantProps } from "class-variance-authority"

const buttonStyles = cva(
  [
    "relative flex justify-center gap-3 overflow-hidden rounded text-sm leading-none ring-1 ring-inset",
    "disabled:cursor-not-allowed loading:cursor-wait loading:before:pointer-events-none",
    "transition-colors duration-100 ease-linear",
  ],
  {
    variants: {
      intent: {
        primary: [
          "bg-button-primary-bg-default text-button-primary-fg-default ring-button-primary-border-default",
          "hover:bg-button-primary-bg-hover hover:text-button-primary-fg-hover hover:ring-button-primary-border-hover",
          "disabled:bg-button-primary-bg-disabled disabled:text-button-primary-fg-disabled disabled:ring-button-primary-border-disabled",
          "loading:bg-button-primary-bg-default loading:text-button-primary-fg-default loading:ring-button-primary-border-default",
          "loading:before:absolute loading:before:inset-0 loading:before:bg-button-primary-bg-default loading:before:opacity-80 loading:before:content-['']",
        ],
        secondary: [
          "bg-button-secondary-bg-default text-button-secondary-fg-default ring-button-secondary-border-default",
          "hover:bg-button-secondary-bg-hover hover:text-button-secondary-fg-hover hover:ring-button-secondary-border-hover",
          "disabled:bg-button-secondary-bg-disabled disabled:text-button-secondary-fg-disabled disabled:ring-button-secondary-border-disabled",
          "loading:bg-button-secondary-bg-default loading:text-button-secondary-fg-default loading:ring-button-secondary-border-default",
          "loading:before:absolute loading:before:inset-0 loading:before:bg-button-secondary-bg-default loading:before:opacity-80 loading:before:content-['']",
        ],
      },
      size: {
        default: ["px-4 py-3"],
        large: ["px-4 py-4.5 max-md:py-3"],
      },
      defaultVariants: {
        intent: "primary",
        size: "default",
      },
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonStyles>

export const DefaultButton = ({
  attributes,
  node,
  onClick,
}: OryNodeButtonProps) => {
  const {
    type,
    name,
    value,
    // Button does not support these attributes, so we skip them
    autocomplete: _ignoredAutocomplete,
    label: _ignoredLabel,
    node_type: _ignoredNodeType,
    // End of skipped attributes
    ...rest
  } = attributes
  const intl = useIntl()
  const label = getNodeLabel(node)
  const { flowType } = useOryFlow()
  const {
    formState: { isSubmitting },
    setValue,
  } = useFormContext()

  const isPrimary =
    attributes.name === "method" ||
    attributes.name.includes("passkey") ||
    attributes.name.includes("webauthn") ||
    attributes.name.includes("lookup_secret")

  const isSmall =
    flowType === FlowType.Settings &&
    attributes.name !== "webauthn_register_trigger"

  return (
    <button
      {...rest}
      value={value}
      name={name}
      type={type === "button" ? "button" : "submit"} // TODO
      onSubmit={() => {
        setValue(name, value)
      }}
      onClick={(e) => {
        onClick?.(e)

        if (type !== "button") {
          setValue(name, value)
        }
      }}
      className={buttonStyles({
        intent: isPrimary ? "primary" : "secondary",
        size: isSmall ? "default" : "large",
      })}
      disabled={rest.disabled ?? true}
      data-loading={isSubmitting}
    >
      {isSubmitting ? <Spinner /> : null}
      {label ? uiTextToFormattedMessage(label, intl) : ""}
    </button>
  )
}

DefaultButton.displayName = "DefaultButton"
