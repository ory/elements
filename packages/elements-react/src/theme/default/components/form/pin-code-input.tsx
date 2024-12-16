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

  const value = watch(name) as string

  return (
    <InputOTP
      maxLength={maxlength ?? 6}
      onChange={handleInputChange}
      name={name}
      value={value}
    >
      <InputOTPGroup className="w-full justify-between space-x-2">
        {[...Array(elements)].map((_, index) => (
          <InputOTPSlot
            index={index}
            key={index}
            className="h-10 w-11 rounded-border-radius-forms border border-solid border-forms-border-default bg-forms-bg-default px-1.5 py-2.5 text-center md:h-12 md:w-14"
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  )
}
