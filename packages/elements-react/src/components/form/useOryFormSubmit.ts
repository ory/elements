// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  OnRedirectHandler,
  UiNodeGroupEnum,
  UpdateLoginFlowBody,
  UpdateRecoveryFlowBody,
  UpdateRegistrationFlowBody,
  UpdateSettingsFlowBody,
  UpdateVerificationFlowBody,
} from "@ory/client-fetch"
import { SubmitHandler, useFormContext } from "react-hook-form"
import { useIntl } from "react-intl"
import { useOryConfiguration, useOryFlow } from "../../context"
import { FormValues } from "../../types"
import { OryFlowContainer } from "../../util"
import { OryErrorHandler } from "../../util/events"
import { onSubmitLogin } from "../../util/onSubmitLogin"
import { onSubmitRecovery } from "../../util/onSubmitRecovery"
import { onSubmitRegistration } from "../../util/onSubmitRegistration"
import { onSubmitSettings } from "../../util/onSubmitSettings"
import { onSubmitVerification } from "../../util/onSubmitVerification"
import {
  appendUiMessage,
  rateLimitedMessageId,
} from "../../util/rateLimitedMessage"
import { removeEmptyStrings } from "../../util/removeFalsyValues"
import { resolveTransientPayload } from "../../util/transientPayload"
import { computeDefaultValues } from "./form-helpers"

// The fields a single sign-on submission may carry, per
// `UpdateLoginFlowWithOidcMethod` and its registration and SAML siblings.
const ssoBodyFields = [
  "csrf_token",
  "id_token",
  "id_token_nonce",
  "method",
  "provider",
  "traits",
  "transient_payload",
  "upstream_parameters",
]

/**
 * The single sign-on buttons share the form state of the card they render in, so that
 * traits the user entered next to them are submitted with the provider. Everything else
 * on that screen belongs to a different method: a typed password or one-time code means
 * nothing to the provider redirect and must not be sent along with it.
 *
 * Settings is excluded: linking and unlinking a provider submits the `oidc` method too,
 * but with `link` / `unlink` fields that are not part of a sign-in submission.
 */
export function withoutForeignMethodFields(
  flowType: FlowType,
  data: FormValues,
): FormValues {
  if (flowType !== FlowType.Login && flowType !== FlowType.Registration) {
    return data
  }

  if (
    data.method !== UiNodeGroupEnum.Oidc &&
    data.method !== UiNodeGroupEnum.Saml
  ) {
    return data
  }

  return Object.fromEntries(
    Object.entries(data).filter(([key]) => ssoBodyFields.includes(key)),
  )
}

// The "select_account" prompt is supported by the following providers.
// This prompt forces the user to select an account, even if they are already logged in.
// This is useful when the user wants to link an account, for example.
// TODO: this list could likely be extended, but the parameter is poorly documented.
const supportsSelectAccountPrompt = ["google", "github"]

export function useOryFormSubmit(
  onAfterSubmit?: (method: string | number | boolean | undefined) => void,
) {
  const flowContainer = useOryFlow()
  const methods = useFormContext()
  const config = useOryConfiguration()

  const { onSuccess, onValidationError, onError, transientPayload } =
    flowContainer

  const intl = useIntl()

  // Wraps the integrator's onError so vanilla Elements shows feedback on a
  // rate limit instead of a silently frozen form. The integrator's handler is
  // awaited first, matching the event ordering contract. Passing the full
  // context value to appendUiMessage is safe: OryFlowProvider re-assigns
  // setFlowContainer and the other extras after spreading the stored value.
  const handleError: OryErrorHandler = async (event) => {
    await onError?.(event)
    if (event.type === "rate_limited") {
      // A rate-limited submission is a handled error: handleFlowError returns
      // without throwing, so onSubmit's catch never runs and would otherwise
      // leave isSubmitting stuck true (action_flow_update preserves it),
      // freezing the form. End the submit state so the form stays usable.
      flowContainer.dispatchFormState({ type: "form_submit_end" })
      flowContainer.setFlowContainer(
        appendUiMessage(flowContainer, {
          id: rateLimitedMessageId,
          type: "error",
          text: intl.formatMessage({
            id: "messages.rate-limited",
            defaultMessage:
              "Too many requests. Please wait a moment and try again.",
          }),
        }),
      )
    }
  }

  const handleSuccess = (flow: OryFlowContainer) => {
    flowContainer.dispatchFormState({ type: "form_submit_end" })
    flowContainer.setFlowContainer(flow)
    const newValues = computeDefaultValues(flow.flow)
    methods.reset(newValues, {
      keepSubmitCount: true,
    })
  }

  const onRedirect: OnRedirectHandler = (url, _external) => {
    flowContainer.dispatchFormState({ type: "page_redirect" })
    window.location.assign(url)
  }

  const mergeTransientPayload = (
    data: FormValues,
  ): Record<string, unknown> | undefined => {
    if (!transientPayload && !data.transient_payload) {
      return undefined
    }

    const existingNodeValues =
      typeof data.transient_payload === "object" &&
      data.transient_payload &&
      !Array.isArray(data.transient_payload)
        ? (data.transient_payload as unknown as Record<string, unknown>)
        : undefined

    const resolved = resolveTransientPayload(
      transientPayload,
      data,
      existingNodeValues ?? undefined,
    )

    return Object.keys(resolved).length > 0 ? resolved : undefined
  }

  const onSubmit: SubmitHandler<FormValues> = async (initialData) => {
    flowContainer.dispatchFormState({ type: "form_submit_start" })
    // This is necessary to avoid sending empty strings to the backend, which can cause validation errors.
    // TODO: Kratos could be improved to handle this better, and treat empty strings as missing values.
    try {
      const data = withoutForeignMethodFields(
        flowContainer.flowType,
        removeEmptyStrings(initialData),
      )
      switch (flowContainer.flowType) {
        case FlowType.Login: {
          const submitData: UpdateLoginFlowBody = {
            ...(data as unknown as UpdateLoginFlowBody),
          }
          if (submitData.method === "code" && data.code) {
            submitData.resend = ""
          }

          const mergedTransientPayload = mergeTransientPayload(data)
          if (mergedTransientPayload) {
            Object.assign(submitData, {
              transient_payload: mergedTransientPayload,
            })
          }

          await onSubmitLogin(flowContainer, config, {
            onRedirect,
            setFlowContainer: handleSuccess,
            body: submitData,
            onSuccess,
            onValidationError,
            onError: handleError,
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

          const mergedTransientPayload = mergeTransientPayload(data)
          if (mergedTransientPayload) {
            Object.assign(submitData, {
              transient_payload: mergedTransientPayload,
            })
          }

          await onSubmitRegistration(flowContainer, config, {
            onRedirect,
            setFlowContainer: handleSuccess,
            body: submitData,
            onSuccess,
            onValidationError,
            onError: handleError,
          })
          break
        }
        case FlowType.Verification: {
          const submitData = {
            ...(data as unknown as UpdateVerificationFlowBody),
          }
          const mergedTransientPayload = mergeTransientPayload(data)
          if (mergedTransientPayload) {
            Object.assign(submitData, {
              transient_payload: mergedTransientPayload,
            })
          }
          await onSubmitVerification(flowContainer, config, {
            onRedirect,
            setFlowContainer: handleSuccess,
            body: submitData,
            onSuccess,
            onValidationError,
            onError: handleError,
          })
          break
        }
        case FlowType.Recovery: {
          const submitData: UpdateRecoveryFlowBody = {
            ...(data as unknown as UpdateRecoveryFlowBody),
          }
          // TODO: We should probably fix this in Kratos, and give the code priority over the email. However, that would be breaking :(
          if (data.code) {
            submitData.email = ""
          }

          const mergedTransientPayload = mergeTransientPayload(data)
          if (mergedTransientPayload) {
            Object.assign(submitData, {
              transient_payload: mergedTransientPayload,
            })
          }

          await onSubmitRecovery(flowContainer, config, {
            onRedirect,
            setFlowContainer: handleSuccess,
            body: submitData,
            onSuccess,
            onValidationError,
            onError: handleError,
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

          // Force the account selection screen on link to provide a better use experience.
          // https://github.com/ory/elements/issues/268
          // TODO: Maybe this needs to be configurable in the configuration
          if (
            submitData.method === UiNodeGroupEnum.Oidc &&
            submitData.link &&
            supportsSelectAccountPrompt.includes(submitData.link)
          ) {
            submitData.upstream_parameters = {
              prompt: "select_account",
            }
          }

          if ("webauthn_remove" in submitData) {
            submitData.method = "webauthn"
          }

          if ("passkey_remove" in submitData) {
            submitData.method = "passkey"
          }

          const mergedTransientPayload = mergeTransientPayload(data)
          if (mergedTransientPayload) {
            Object.assign(submitData, {
              transient_payload: mergedTransientPayload,
            })
          }

          await onSubmitSettings(flowContainer, config, {
            onRedirect,
            setFlowContainer: handleSuccess,
            body: submitData,
            onSuccess,
            onValidationError,
            onError: handleError,
          })
          break
        }
        case FlowType.OAuth2Consent: {
          // TODO: move this to a full fleged SDK method?
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
            await onSuccess?.({
              flowType: FlowType.OAuth2Consent,
              consentRequest: flowContainer.flow.consent_request,
            })
            onRedirect(oauth2Success.redirect_to as string, true)
            break
          }
          await handleError({
            type: "consent_error",
            flowType: FlowType.OAuth2Consent,
            consentRequest: flowContainer.flow.consent_request,
          })
          throw new Error(
            `[@ory/elements-react] OAuth2 consent flow not completed. This indicates a bug in Ory. Report this issue at https://github.com/ory/elements/issues. \nResponse from ${flowContainer.flow.ui.action}: ${JSON.stringify(oauth2Success)}`,
          )
        }
      }
      if ("password" in data) {
        methods.setValue("password", "")
      }
      if ("code" in data) {
        methods.setValue("code", "")
      }
      if ("totp_code" in data) {
        methods.setValue("totp_code", "")
      }
      onAfterSubmit?.(data.method)
    } catch (error) {
      // Fail safe, ensure that the submit state is ended
      // But in practice none of the above methods should throw
      flowContainer.dispatchFormState({ type: "form_submit_end" })
      throw error
    }
  }

  return onSubmit
}
