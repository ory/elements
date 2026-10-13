// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { FlowType } from "@ory/client-fetch"
import { OryNodeInputProps, useOryFlow } from "@ory/elements-react"
import { cn } from "../../utils/cn"
import { DefaultInput } from "./input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./shadcn/otp-input"

// Longer codes do not fit one box per character on narrow screens.
const maxPinCodeLength = 8

export const DefaultPinCodeInput = (props: OryNodeInputProps) => {
  const { node, inputProps } = props
  const { flowType } = useOryFlow()

  const { value, maxLength, ...restInputProps } = inputProps
  const elements = maxLength ?? 6
  if (elements > maxPinCodeLength) {
    return <DefaultInput {...props} />
  }

  const valueCasted = value as string

  return (
    <InputOTP
      data-testid={`ory/form/node/input/${node.attributes.name}`}
      {...restInputProps}
      value={valueCasted}
      maxLength={elements}
    >
      <InputOTPGroup
        className={cn(
          "flex w-full justify-stretch gap-2",
          // The settings flow input fields are supposed to be dense, so we don't need the extra padding we want on the user flows.
          flowType === FlowType.Settings && "max-w-[488px]",
        )}
      >
        {[...Array(elements)].map((_, index) => (
          <InputOTPSlot index={index} key={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  )
}
