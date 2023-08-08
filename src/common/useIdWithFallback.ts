// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import * as React from "react"

const fallback = () => Math.random().toString(36).substring(2)

/**
 * A function to obtain a unique ID. If react is available, this
 * is just a wrapper for React.useId(), meaning the ID will be
 * consistent across SSR and CSR. Otherwise, it will be a random and
 * unique ID on every call.
 */
export const useIdWithFallback = () => {
  const useId =
    (Object.entries(React).find(([key]) => key === "useId")?.[1] as
      | undefined
      | (() => string)) ?? fallback
  return useId()
}
