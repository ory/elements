// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { useFormContext } from "react-hook-form"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./shadcn/otp-input"
import { OryNodeInputProps } from "@ory/elements-react"

export const DefaultPinCodeInput = ({ attributes }: OryNodeInputProps) => {
  const { setValue, watch } = useFormContext()
  const { maxlength, name } = attributes
  const elements = maxlength ?? 6

  const handleInputChange = (v: string) => {
    setValue(name, v)
  }

  const value = watch(name)

  return (
    <InputOTP
      maxLength={maxlength ?? 6}
      onChange={handleInputChange}
      name={name}
      value={value}
    >
      <InputOTPGroup className="w-full space-x-2 justify-between">
        {[...Array(elements)].map((_, index) => (
          <InputOTPSlot
            index={index}
            key={index}
            className="text-center px-1.5 py-2.5 h-10 w-11 md:w-14 md:h-12 border border-radius border-solid rounded-border-radius-forms border-forms-border-default bg-forms-bg-default"
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  )
}
