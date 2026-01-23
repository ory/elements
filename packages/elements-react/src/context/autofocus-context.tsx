// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { createContext, useContext, useRef, PropsWithChildren } from "react"

type AutofocusContextValue = {
  claimAutofocus: () => boolean
}

const AutofocusContext = createContext<AutofocusContextValue | null>(null)

export function AutofocusProvider({ children }: PropsWithChildren) {
  const claimed = useRef(false)

  const claimAutofocus = () => {
    if (claimed.current) return false
    claimed.current = true
    return true
  }

  return (
    <AutofocusContext.Provider value={{ claimAutofocus }}>
      {children}
    </AutofocusContext.Provider>
  )
}

export function useAutofocus(): AutofocusContextValue {
  const context = useContext(AutofocusContext)
  if (!context) return { claimAutofocus: () => false }
  return context
}
