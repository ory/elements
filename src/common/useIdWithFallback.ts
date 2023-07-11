import React from 'react'

/**
 * A function to obtain a unique ID. If react is available, this
 * is just a wrapper for React.useId(), meaning the ID will be
 * consistent across SSR and CSR. Otherwise, it will be a random and
 * unique ID on every call.
 */
export const useIdWithFallback = () => {
  try {
    return React.useId()
  } catch (e) {
    return Math.random().toString(36).substring(2)
  }
}
