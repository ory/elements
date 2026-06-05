// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { getNodeLabel } from "@ory/client-fetch"
import {
  type OryNodeButtonProps,
  uiTextToFormattedMessage,
} from "@ory/elements-react"
import { cva } from "class-variance-authority"
import { useIntl } from "react-intl"
import { Spinner } from "./spinner"
import { useMemo } from "react"
import { cn } from "../../utils/cn"

export const buttonStyles = cva(
  [
    "group relative flex cursor-pointer justify-center gap-3 overflow-hidden rounded-buttons leading-none font-medium ring-1 ring-inset",
    "disabled:cursor-not-allowed loading:pointer-events-none loading:cursor-wait",
    "transition-colors duration-100 ease-linear",
    "max-w-[488px] p-4",
  ],
  {
    variants: {
      intent: {
        primary: [
          "bg-button-primary-background-default text-button-primary-foreground-default ring-button-primary-border-default",
          "hover:bg-button-primary-background-hover hover:text-button-primary-foreground-hover hover:ring-button-primary-border-hover",
          "disabled:bg-button-primary-background-disabled disabled:text-button-primary-foreground-disabled disabled:ring-button-primary-border-disabled",
          "loading:bg-button-primary-background-default loading:text-button-primary-foreground-default loading:ring-button-primary-border-default",
        ],
        secondary: [
          "bg-button-secondary-background-default text-button-secondary-foreground-default ring-button-secondary-border-default",
          "hover:bg-button-secondary-background-hover hover:text-button-secondary-foreground-hover hover:ring-button-secondary-border-hover",
          "disabled:bg-button-secondary-background-disabled disabled:text-button-secondary-foreground-disabled disabled:ring-button-secondary-border-disabled",
          "loading:bg-button-secondary-background-default loading:text-button-secondary-foreground-default loading:ring-button-secondary-border-default",
        ],
        social: [
          "bg-button-social-background-default text-button-social-foreground-default ring-button-social-border-default",
          "hover:bg-button-social-background-hover hover:text-button-social-foreground-hover hover:ring-button-social-border-hover",
          "disabled:bg-button-social-background-disabled disabled:text-button-social-foreground-disabled disabled:ring-button-social-border-disabled",
          "loading:bg-button-social-background-default loading:text-button-social-foreground-default loading:ring-button-social-border-default",
        ],
      },
    },
  },
)

export const DefaultButton = ({
  node,
  buttonProps,
  isSubmitting,
}: OryNodeButtonProps) => {
  const intl = useIntl()
  const label = getNodeLabel(node)

  const isPrimary = useMemo(() => {
    return (
      node.attributes.name === "method" ||
      node.attributes.name.includes("passkey") ||
      node.attributes.name.includes("webauthn") ||
      node.attributes.name.includes("lookup_secret") ||
      (node.attributes.name.includes("action") &&
        node.attributes.value === "accept")
    )
  }, [node.attributes.name, node.attributes.value])

  return (
    <button
      {...buttonProps}
      data-testid={`ory/form/node/button/${node.attributes.name}`}
      data-loading={isSubmitting}
      className={buttonStyles({
        intent: isPrimary ? "primary" : "secondary",
      })}
    >
      {isSubmitting && (
        <Spinner
          className={cn(
            isPrimary
              ? "stroke-button-primary-foreground-default"
              : "stroke-button-secondary-foreground-default",
          )}
        />
      )}
      {label && (
        <span className="group-loading:opacity-20">
          {uiTextToFormattedMessage(label, intl)}
        </span>
      )}
    </button>
  )
}

DefaultButton.displayName = "DefaultButton"
