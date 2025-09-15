// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { useFormContext } from "react-hook-form"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./shadcn/otp-input"
import { OryNodeInputProps, useOryFlow } from "@ory/elements-react"
import { FlowType } from "@ory/client-fetch"
import { cn } from "../../utils/cn"

export const DefaultPinCodeInput = ({ attributes }: OryNodeInputProps) => {
  const { setValue, watch } = useFormContext()
  const { maxlength, name } = attributes
  const elements = maxlength ?? 6
  const { flowType } = useOryFlow()

  const handleInputChange = (v: string) => {
    setValue(name, v)
  }

  const value = watch(name) as string

  return (
    <InputOTP
      maxLength={maxlength ?? 6}
      onChange={handleInputChange}
      name={name}
      value={value}
      data-testid={`ory/form/node/input/${name}`}
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
