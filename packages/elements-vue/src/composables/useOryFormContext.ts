// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { inject, provide, type InjectionKey } from "vue"
import type { UseOryFormReturn } from "./useOryForm"

const OryFormContextKey: InjectionKey<UseOryFormReturn> =
  Symbol("OryFormContext")

/**
 * Provides the form context to child components.
 */
export function provideOryForm(form: UseOryFormReturn) {
  provide(OryFormContextKey, form)
}

/**
 * Injects the form context from a parent OryForm component.
 *
 * @throws Error if used outside of an OryForm component.
 */
export function useOryFormContext(): UseOryFormReturn {
  const context = inject(OryFormContextKey)
  if (!context) {
    throw new Error(
      "useOryFormContext must be used within an OryForm component. " +
        "Make sure the component is wrapped in an OryForm.",
    )
  }
  return context
}

/**
 * Injects the form context, or returns undefined if not in a form context.
 * Use this when form context is optional.
 */
export function useOptionalOryFormContext(): UseOryFormReturn | undefined {
  return inject(OryFormContextKey)
}
