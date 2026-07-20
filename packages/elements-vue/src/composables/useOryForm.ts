// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  UiNodeGroupEnum,
  UpdateLoginFlowBody,
  UpdateRecoveryFlowBody,
  UpdateRegistrationFlowBody,
  UpdateSettingsFlowBody,
  UpdateVerificationFlowBody,
  isUiNodeInputAttributes,
} from "@ory/client-fetch"
import { ref, reactive, computed, type Ref, type ComputedRef } from "vue"
import { useOryFlow } from "./useOryFlow"
import { useOryConfig } from "./useOryConfig"
import { OryFlowContainer } from "../util/flowContainer"
import {
  removeEmptyStrings,
  expandDotNotation,
} from "../util/removeFalsyValues"
import { onSubmitLogin } from "../util/onSubmitLogin"
import { onSubmitRegistration } from "../util/onSubmitRegistration"
import { onSubmitRecovery } from "../util/onSubmitRecovery"
import { onSubmitVerification } from "../util/onSubmitVerification"
import { onSubmitSettings } from "../util/onSubmitSettings"
import type { FormValues } from "../types"

// The "select_account" prompt is supported by the following providers.
const supportsSelectAccountPrompt = ["google", "github"]

/**
 * Computes default values from a flow's UI nodes.
 */
function computeDefaultValues(flow: OryFlowContainer["flow"]): FormValues {
  const values: FormValues = {}

  // Set method from flow.active if present (mirrors React implementation)
  const flowActive = (flow as { active?: string }).active
  if (flowActive) {
    values.method = flowActive
  }

  for (const node of flow.ui.nodes) {
    if (isUiNodeInputAttributes(node.attributes)) {
      const { name, value, type } = node.attributes

      // Don't include submit buttons in default values
      if (type === "submit" || type === "button") {
        continue
      }

      // Skip method input - we set it from flow.active above
      if (name === "method") {
        continue
      }

      // Handle grant_scope as an array for OAuth2 consent
      if (name === "grant_scope") {
        const scope = value as string
        const existingScopes = values.grant_scope
        if (Array.isArray(existingScopes)) {
          // Add scope to array (all scopes selected by default)
          values.grant_scope = [...existingScopes, scope]
        } else {
          values.grant_scope = [scope]
        }
        continue
      }

      if (type === "checkbox") {
        values[name] = value === true || value === "true"
      } else {
        values[name] = value
      }
    }
  }

  return values
}

export interface UseOryFormOptions {
  /**
   * Callback called after form submission.
   */
  onAfterSubmit?: (method: string | number | boolean | undefined) => void
}

export interface UseOryFormReturn {
  /**
   * Reactive form values.
   */
  values: FormValues

  /**
   * Whether the form is currently submitting.
   */
  isSubmitting: Ref<boolean>

  /**
   * Sets a form field value.
   */
  setValue: (
    name: string,
    value: string | number | boolean | string[] | undefined,
  ) => void

  /**
   * Gets a form field value.
   */
  getValue: (name: string) => string | number | boolean | string[] | undefined

  /**
   * Resets the form to default values.
   */
  reset: () => void

  /**
   * Submits the form.
   */
  handleSubmit: (event?: Event) => Promise<void>

  /**
   * The form action URL.
   */
  action: ComputedRef<string>

  /**
   * The form method (POST/GET).
   */
  method: ComputedRef<string>
}

/**
 * Vue composable for handling Ory form submission using native Vue reactivity.
 *
 * @param options - Form options
 */
export function useOryForm(options: UseOryFormOptions = {}): UseOryFormReturn {
  const flowContext = useOryFlow()
  const config = useOryConfig()

  const isSubmitting = ref(false)
  const isRedirecting = ref(false)
  const values = reactive<FormValues>(
    computeDefaultValues(flowContext.flowContainer.value.flow),
  )

  const action = computed(() => flowContext.flowContainer.value.flow.ui.action)
  const method = computed(() => flowContext.flowContainer.value.flow.ui.method)

  function setValue(
    name: string,
    value: string | number | boolean | string[] | undefined,
  ) {
    values[name] = value
  }

  function getValue(name: string) {
    return values[name]
  }

  function replaceValues(newValues: FormValues) {
    Object.keys(values).forEach((key) => {
      delete values[key]
    })
    Object.assign(values, newValues)
  }

  function reset() {
    replaceValues(computeDefaultValues(flowContext.flowContainer.value.flow))
  }

  function handleSuccess(flow: OryFlowContainer) {
    flowContext.setFlowContainer(flow)
    replaceValues(computeDefaultValues(flow.flow))
  }

  function onRedirect(url: string, _external: boolean) {
    if (typeof window !== "undefined") {
      // Mark that we're redirecting to prevent cleanup code from running
      isRedirecting.value = true
      window.location.assign(url)
    }
  }

  async function handleSubmit(event?: Event) {
    event?.preventDefault()

    isSubmitting.value = true

    try {
      // Build form data primarily from reactive store (like react-hook-form)
      // The reactive store is the source of truth for all form values
      const formData: FormValues = { ...values }

      // Get submitter info (for the method field from button clicks)
      if (event && "submitter" in event) {
        const submitter = (event as SubmitEvent)
          .submitter as HTMLButtonElement | null
        if (submitter && submitter.name && submitter.value) {
          formData[submitter.name] = submitter.value
        }
      }

      // Read external values from DOM (e.g., WebAuthn scripts setting hidden inputs)
      // These take precedence as they're set by external scripts after our reactive state
      if (event?.target instanceof HTMLFormElement) {
        const form = event.target
        const externalInputs = [
          "method",
          "webauthn_login",
          "webauthn_register",
          "passkey_login",
          "passkey_register",
          "passkey_settings_register",
        ]
        externalInputs.forEach((name) => {
          const input = form.querySelector<HTMLInputElement>(
            `input[name="${name}"]`,
          )
          if (input && input.value) {
            formData[name] = input.value
          }
        })
      }

      // Expand dot notation keys (e.g., "traits.email" -> { traits: { email: ... } })
      const expandedData = expandDotNotation(
        formData as Record<string, unknown>,
      )
      const data = removeEmptyStrings(expandedData)

      const flowContainer = flowContext.flowContainer.value

      switch (flowContainer.flowType) {
        case FlowType.Login: {
          const submitData: UpdateLoginFlowBody = {
            ...(data as unknown as UpdateLoginFlowBody),
          }
          if (submitData.method === "code" && data.code) {
            submitData.resend = ""
          }

          await onSubmitLogin(flowContainer, config, {
            onRedirect,
            setFlowContainer: handleSuccess,
            body: submitData,
          })
          break
        }
        case FlowType.Registration: {
          const submitData: UpdateRegistrationFlowBody = {
            ...(data as unknown as UpdateRegistrationFlowBody),
          }

          if (submitData.method === "code" && submitData.code) {
            submitData.resend = ""
          }

          await onSubmitRegistration(flowContainer, config, {
            onRedirect,
            setFlowContainer: handleSuccess,
            body: submitData,
          })
          break
        }
        case FlowType.Verification:
          await onSubmitVerification(flowContainer, config, {
            onRedirect,
            setFlowContainer: handleSuccess,
            body: data as unknown as UpdateVerificationFlowBody,
          })
          break
        case FlowType.Recovery: {
          const submitData: UpdateRecoveryFlowBody = {
            ...(data as unknown as UpdateRecoveryFlowBody),
          }
          if (data.code) {
            submitData.email = ""
          }
          await onSubmitRecovery(flowContainer, config, {
            onRedirect,
            setFlowContainer: handleSuccess,
            body: submitData,
          })
          break
        }
        case FlowType.Settings: {
          const submitData: UpdateSettingsFlowBody = {
            ...(data as unknown as UpdateSettingsFlowBody),
          }

          if ("totp_unlink" in submitData) {
            submitData.method = "totp"
          }

          if (
            "lookup_secret_confirm" in submitData ||
            "lookup_secret_reveal" in submitData ||
            "lookup_secret_regenerate" in submitData ||
            "lookup_secret_disable" in submitData
          ) {
            submitData.method = "lookup_secret"
          }

          if (
            submitData.method === UiNodeGroupEnum.Oidc &&
            submitData.link &&
            supportsSelectAccountPrompt.includes(submitData.link)
          ) {
            submitData.upstream_parameters = {
              prompt: "select_account",
            }
          }

          if (
            "webauthn_remove" in submitData ||
            "webauthn_register" in submitData
          ) {
            submitData.method = "webauthn"
          }

          if (
            "passkey_remove" in submitData ||
            "passkey_settings_register" in submitData
          ) {
            submitData.method = "passkey"
          }

          await onSubmitSettings(flowContainer, config, {
            onRedirect,
            setFlowContainer: handleSuccess,
            body: submitData,
          })
          break
        }
        case FlowType.OAuth2Consent: {
          const response = await fetch(flowContainer.flow.ui.action, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          })
          const oauth2Success = await response.json()
          if (
            oauth2Success.redirect_to &&
            typeof oauth2Success.redirect_to === "string"
          ) {
            onRedirect(oauth2Success.redirect_to as string, true)
          }
          break
        }
      }

      // Clear sensitive fields after submission (but not if redirecting)
      if (!isRedirecting.value) {
        const sensitiveFields = ["password", "code", "totp_code"]
        sensitiveFields.forEach((field) => {
          if (field in values) {
            values[field] = ""
          }
        })
      }

      // Method is never an array, cast to exclude string[]
      options.onAfterSubmit?.(
        (data as FormValues).method as string | number | boolean | undefined,
      )
    } finally {
      // Don't reset submitting state if we're redirecting (keeps spinner visible)
      if (!isRedirecting.value) {
        isSubmitting.value = false
      }
    }
  }

  return {
    values,
    isSubmitting,
    setValue,
    getValue,
    reset,
    handleSubmit,
    action,
    method,
  }
}
