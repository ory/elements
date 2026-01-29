// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument */

import {
  defineNuxtRouteMiddleware,
  navigateTo,
  useRequestHeaders,
  useRuntimeConfig,
} from "#imports"
import { createFrontendClient } from "../utils/sdk"
import { ResponseError } from "@ory/client-fetch"

/**
 * Checks if the error response indicates AAL2 is required.
 */
async function isSessionAal2RequiredError(
  error: unknown,
): Promise<{ required: boolean; redirectTo?: string }> {
  if (!(error instanceof ResponseError)) {
    return { required: false }
  }

  try {
    const body = await error.response.clone().json()
    if (body?.error?.id === "session_aal2_required") {
      return {
        required: true,
        redirectTo: body.redirect_browser_to,
      }
    }
  } catch {
    // Ignore JSON parse errors
  }

  return { required: false }
}

/**
 * Route middleware that protects pages by requiring authentication.
 *
 * This middleware checks for a valid session and handles AAL2 (2FA) requirements.
 * If the user has a session but needs to complete 2FA, they will be redirected
 * to the login page with `?aal=aal2`.
 *
 * Usage in a page:
 * ```vue
 * <script setup>
 * definePageMeta({
 *   middleware: 'auth'
 * })
 * </script>
 * ```
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware on client-side navigation if we already checked
  if (import.meta.client) {
    return
  }

  const headers = useRequestHeaders(["cookie"])
  const cookie = headers.cookie
  const config = useRuntimeConfig()
  const loginUrl = config.public.ory?.project?.login_ui_url || "/auth/login"

  try {
    const frontend = createFrontendClient()
    await frontend.toSession({ cookie })
    // Session exists with sufficient AAL, allow access
  } catch (error) {
    // Check if session exists but AAL2 is required
    const aal2Check = await isSessionAal2RequiredError(error)

    if (aal2Check.required) {
      // User has session but needs to complete 2FA
      // Use the redirect URL from the error if available, otherwise construct one
      if (aal2Check.redirectTo) {
        return navigateTo(aal2Check.redirectTo, { external: true })
      }

      const aal2LoginUrl = `${loginUrl}?aal=aal2&return_to=${encodeURIComponent(to.fullPath)}`
      return navigateTo(aal2LoginUrl, { external: true })
    }

    // No session at all, redirect to login
    const returnUrl = `${loginUrl}?return_to=${encodeURIComponent(to.fullPath)}`
    return navigateTo(returnUrl, { external: true })
  }
})
