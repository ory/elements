// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import * as React from "react"

const fallback = () => Math.random().toString(36).substring(2)

/**
 * A function to obtain a unique ID. If React is available, this
 * is just a wrapper for React.useId(), meaning the ID will be
 * consistent across SSR and CSR. Otherwise, it will be a random and
 * unique ID on every call.
 */
export const useIdWithFallback = () => {
  const useId =
    // This is just a hacky way of optionally importing useId. If
    // it's imported the regular way, or we even attempt to read
    // the `useId` property of React, webpack seems to throw an
    // error. Since `useId` isn't a hard dependency, we're fine
    // with it not existing and this prevents the error from
    // occurring.
    (Object.entries(React).find(([key]) => key === "useId")?.[1] as
      | undefined
      | (() => string)) ?? fallback
  return useId()
}
