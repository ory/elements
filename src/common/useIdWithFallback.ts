import React from 'react'

export const useIdWithFallback = () => {
  try {
    return React.useId()
  } catch (e) {
    return Math.random().toString(36).substring(2)
  }
}
