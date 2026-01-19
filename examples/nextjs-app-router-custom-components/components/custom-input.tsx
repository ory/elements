// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryNodeInputProps } from "@ory/elements-react"

export function MyCustomInput({ inputProps }: OryNodeInputProps) {
  return (
    <input
      {...inputProps}
      className="border-2 border-green-500 p-2 rounded-md disabled:bg-gray-500 w-full"
    />
  )
}
