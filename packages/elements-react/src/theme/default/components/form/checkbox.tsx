// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useIntl } from "react-intl"
import { cn } from "../../utils/cn"
import { HeadlessInputProps } from "@ory/elements-react"
import { formatMessage, messageTestId } from "@ory/elements-react"
import { getNodeLabel } from "@ory/client-fetch"

function CheckboxSVG() {
  return (
    <svg
      className="absolute w-4 h-4 hidden peer-checked:block"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M0 4C0 1.79086 1.79086 0 4 0H12C14.2091 0 16 1.79086 16 4V12C16 14.2091 14.2091 16 12 16H4C1.79086 16 0 14.2091 0 12V4Z"
        fill="#0F172A"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.6464 5.14645C11.8417 4.95118 12.1583 4.95118 12.3536 5.14645C12.5338 5.32669 12.5477 5.6103 12.3951 5.80645L12.3536 5.85355L7.35355 10.8536C7.17331 11.0338 6.8897 11.0477 6.69355 10.8951L6.64645 10.8536L4.14645 8.35355C3.95118 8.15829 3.95118 7.84171 4.14645 7.64645C4.32669 7.4662 4.6103 7.45234 4.80645 7.60485L4.85355 7.64645L7 9.7925L11.6464 5.14645Z"
        fill="white"
      />
    </svg>
  )
}

export const DefaultCheckbox = ({
  attributes: initialAttributes,
  node,
}: HeadlessInputProps) => {
  const {
    value,
    name,
    // Button does not support these attributes, so we skip them
    autocomplete: _autocomplete,
    onclick: _onclick,
    // End of skipped attributes
    ...attributes
  } = initialAttributes

  const intl = useIntl()
  const label = getNodeLabel(node)
  const [checked, setChecked] = useState(Boolean(value))
  const { register } = useForm()

  return (
    <div
      className="flex antialiased gap-3 self-stretch item-start"
      onClick={() => {
        setChecked(!checked)
      }}
    >
      <div className="flex h-5 items-center">
        <input
          {...attributes}
          checked={checked}
          value={1}
          type="checkbox"
          className={cn(
            "peer w-4 h-4 border appearance-none rounded-border-radius-buttons",
            !checked &&
              "bg-forms-checkbox-bg-default border-forms-checkbox-border-default",
            checked &&
              "bg-forms-checkbox-bg-checked border-forms-checkbox-border-checked",
          )}
          {...register(name, { value })}
        />
        <CheckboxSVG />
      </div>
      <div className="text-sm items-center">
        <label className="text-sm font-normal leading-normal text-forms-fg-default">
          {label && formatMessage(label, intl)}
        </label>
        {node.messages.map((message) => (
          <span
            key={message.id}
            className="text-sm text-red-900 mt-1"
            {...messageTestId(message)}
          >
            {formatMessage(message, intl)}
          </span>
        ))}
      </div>
    </div>
  )
}
