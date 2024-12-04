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
  try {
    // This weird import circumvents webpack's exportPresence check,
    // since we're fine if the import doesn't exist, and we don't want
    // it to cause a build error.
    return React["useId".toString() as "useId"]() ?? fallback()
  } catch (_e) {
    return fallback()
  }
}
