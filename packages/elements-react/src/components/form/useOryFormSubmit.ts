// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  OnRedirectHandler,
  UpdateLoginFlowBody,
  UpdateRecoveryFlowBody,
  UpdateRegistrationFlowBody,
  UpdateSettingsFlowBody,
  UpdateVerificationFlowBody,
} from "@ory/client-fetch"
import { SubmitHandler, useFormContext } from "react-hook-form"
import { useOryFlow } from "../../context"
import { FormValues } from "../../types"
import { OryFlowContainer } from "../../util"
import { onSubmitLogin } from "../../util/onSubmitLogin"
import { onSubmitRecovery } from "../../util/onSubmitRecovery"
import { onSubmitRegistration } from "../../util/onSubmitRegistration"
import { onSubmitSettings } from "../../util/onSubmitSettings"
import { onSubmitVerification } from "../../util/onSubmitVerification"
import { computeDefaultValues } from "./form-helpers"

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

  const handleSuccess = (flow: OryFlowContainer) => {
    flowContainer.setFlowContainer(flow)
    flowContainer.setErrors(
      (flow.flow.ui.messages || []).filter((m) => m.type === "error"),
    )
    methods.reset(computeDefaultValues(flow.flow.ui.nodes))
  }

  const onRedirect: OnRedirectHandler = (url, _external) => {
    window.location.assign(url)
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    switch (flowContainer.flowType) {
      case FlowType.Login: {
        const submitData: UpdateLoginFlowBody = {
          ...(data as unknown as UpdateLoginFlowBody),
        }
        if (submitData.method === "code" && data.code) {
          submitData.resend = ""
        }

        await onSubmitLogin(flowContainer, {
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

        await onSubmitRegistration(flowContainer, {
          onRedirect,
          setFlowContainer: handleSuccess,
          body: submitData,
        })
        break
      }
      case FlowType.Verification:
        await onSubmitVerification(flowContainer, {
          onRedirect,
          setFlowContainer: handleSuccess,
          body: data as unknown as UpdateVerificationFlowBody,
        })
        break
      case FlowType.Recovery: {
        const submitData: UpdateRecoveryFlowBody = {
          ...(data as unknown as UpdateRecoveryFlowBody),
        }
        // TODO: We should probably fix this in Kratos, and give the code priority over the email. However, that would be breaking :(
        if (data.code) {
          submitData.email = ""
        }
        await onSubmitRecovery(flowContainer, {
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

        // Force the account selection screen on link to provide a better use experience.
        // https://github.com/ory/elements/issues/268
        // TODO: Maybe this needs to be configurable in the configuration
        if (
          submitData.method === "oidc" &&
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

        await onSubmitSettings(flowContainer, {
          onRedirect,
          setFlowContainer: handleSuccess,
          body: submitData,
        })
        break
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
  }

  return onSubmit
}
