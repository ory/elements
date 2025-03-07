// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { getNodeLabel } from "@ory/client-fetch"
import {
  OryNodeButtonProps,
  uiTextToFormattedMessage,
} from "@ory/elements-react"
import { cva, VariantProps } from "class-variance-authority"
import { useFormContext } from "react-hook-form"
import { useIntl } from "react-intl"
import { Spinner } from "./spinner"
import { useEffect, useState } from "react"

const buttonStyles = cva(
  [
    "relative flex justify-center gap-3 overflow-hidden rounded-buttons leading-none ring-1 ring-inset font-medium",
    "disabled:cursor-not-allowed loading:cursor-wait loading:before:pointer-events-none",
    "transition-colors duration-100 ease-linear",
    "p-4 max-w-[488px]",
  ],
  {
    variants: {
      intent: {
        primary: [
          "bg-button-primary-background-default text-button-primary-foreground-default ring-button-primary-border-default",
          "hover:bg-button-primary-background-hover hover:text-button-primary-foreground-hover hover:ring-button-primary-border-hover",
          "disabled:bg-button-primary-background-disabled disabled:text-button-primary-foreground-disabled disabled:ring-button-primary-border-disabled",
          "loading:bg-button-primary-background-default loading:text-button-primary-foreground-default loading:ring-button-primary-border-default",
          "loading:before:absolute loading:before:inset-0 loading:before:bg-button-primary-background-default loading:before:opacity-80 loading:before:content-['']",
          "disabled:bg-button-primary-background-disabled disabled:text-button-primary-foreground-disabled disabled:ring-button-primary-border-disabled",
        ],
        secondary: [
          "bg-button-secondary-background-default text-button-secondary-foreground-default ring-button-secondary-border-default",
          "hover:bg-button-secondary-background-hover hover:text-button-secondary-foreground-hover hover:ring-button-secondary-border-hover",
          "disabled:bg-button-secondary-background-disabled disabled:text-button-secondary-foreground-disabled disabled:ring-button-secondary-border-disabled",
          "loading:bg-button-secondary-background-default loading:text-button-secondary-foreground-default loading:ring-button-secondary-border-default",
          "loading:before:absolute loading:before:inset-0 loading:before:bg-button-secondary-background-default loading:before:opacity-80 loading:before:content-['']",
        ],
      },
      defaultVariants: {
        intent: "primary",
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
    maxlength: _ignoredMaxLength,
    // End of skipped attributes
    ...rest
  } = attributes
  const [clicked, setClicked] = useState(false)
  const intl = useIntl()
  const label = getNodeLabel(node)
  const {
    formState: { isSubmitting },
    setValue,
  } = useFormContext()

  useEffect(() => {
    if (!isSubmitting) {
      setClicked(false)
    }
  }, [isSubmitting])

  const isPrimary =
    attributes.name === "method" ||
    attributes.name.includes("passkey") ||
    attributes.name.includes("webauthn") ||
    attributes.name.includes("lookup_secret") ||
    (attributes.name.includes("action") && attributes.value === "accept")

  return (
    <button
      {...rest}
      value={value}
      name={name}
      type={type === "button" ? "button" : "submit"} // TODO
      onClick={(e) => {
        onClick?.(e)
        setClicked(true)

        if (type !== "button") {
          setValue(name, value)
        }
      }}
      className={buttonStyles({
        intent: isPrimary ? "primary" : "secondary",
      })}
      disabled={rest.disabled ?? isSubmitting}
      data-loading={clicked}
    >
      {clicked ? <Spinner /> : null}
      {label ? <span>{uiTextToFormattedMessage(label, intl)}</span> : ""}
    </button>
  )
}

DefaultButton.displayName = "DefaultButton"
