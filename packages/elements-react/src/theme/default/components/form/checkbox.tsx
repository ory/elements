// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { getNodeLabel } from "@ory/client-fetch"
import {
  messageTestId,
  OryNodeInputProps,
  uiTextToFormattedMessage,
} from "@ory/elements-react"
import { useFormContext } from "react-hook-form"
import { useIntl } from "react-intl"
import { cn } from "../../utils/cn"
import { CheckboxLabel } from "../ui/checkbox-label"
import { omitInputAttributes } from "../../../../util/omitAttributes"

function CheckboxSVG() {
  return (
    <svg
      className="absolute hidden size-4 fill-checkbox-foreground-checked peer-checked:block"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.6464 5.14645C11.8417 4.95118 12.1583 4.95118 12.3536 5.14645C12.5338 5.32669 12.5477 5.6103 12.3951 5.80645L12.3536 5.85355L7.35355 10.8536C7.17331 11.0338 6.8897 11.0477 6.69355 10.8951L6.64645 10.8536L4.14645 8.35355C3.95118 8.15829 3.95118 7.84171 4.14645 7.64645C4.32669 7.4662 4.6103 7.45234 4.80645 7.60485L4.85355 7.64645L7 9.7925L11.6464 5.14645Z"
      />
    </svg>
  )
}

export const DefaultCheckbox = ({
  attributes: initialAttributes,
  node,
}: OryNodeInputProps) => {
  const { value, name, ...attributes } = initialAttributes

  const intl = useIntl()
  const label = getNodeLabel(node)
  const { register } = useFormContext()
  const hasError = node.messages.some((m) => m.type === "error")

  return (
    <label className="flex items-start gap-3 self-stretch antialiased">
      <span className="flex h-5 items-center">
        <input
          {...omitInputAttributes(attributes)}
          defaultChecked={Boolean(value)}
          type="checkbox"
          className={cn(
            "peer size-4 appearance-none rounded-forms border border-checkbox-border-checkbox-border-default bg-checkbox-background-default checked:border-checkbox-border-checkbox-border-checked checked:bg-checkbox-background-checked",
            hasError && "border-interface-border-validation-danger",
          )}
          data-testid={`ory/form/node/input/${name}`}
          {...register(name)}
        />
        <CheckboxSVG />
      </span>
      <span className="flex flex-col">
        <span className="leading-tight font-normal text-interface-foreground-default-primary">
          <CheckboxLabel label={label} />
        </span>
        {node.messages.map((message) => (
          <span
            key={message.id}
            className={cn(
              "mt-1",
              message.type === "error"
                ? "text-interface-foreground-validation-danger"
                : "text-interface-foreground-default-secondary",
            )}
            {...messageTestId(message)}
          >
            {uiTextToFormattedMessage(message, intl)}
          </span>
        ))}
      </span>
    </label>
  )
}
