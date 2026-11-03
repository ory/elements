// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"

import { useFormContext } from "react-hook-form"
import { useOryFlow } from "./flow-context"

/**
 * Why the surrounding form cannot be used right now.
 *
 * - `hydrating`: the form was rendered on the server and React has not taken
 *   it over yet. Controls are disabled.
 * - `submitting`: the form is being submitted, or the page is redirecting
 *   after a submit.
 * - `undefined`: the form is idle.
 */
export type OryFormBusyState = "hydrating" | "submitting" | undefined

/**
 * Returns the busy state of the surrounding form, from the first server
 * render on. Use it in a custom `Form.Root` to show a loading state.
 *
 * @returns the busy state of the form.
 * @group Hooks
 */
export function useOryFormBusy(): OryFormBusyState {
  const { formState } = useOryFlow()
  const form = useFormContext()

  if (form && !form.formState.isReady) {
    return "hydrating"
  }
  if (formState.isSubmitting) {
    return "submitting"
  }
  return undefined
}
