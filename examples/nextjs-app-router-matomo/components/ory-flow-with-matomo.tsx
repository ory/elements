// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"

import {
  Login,
  Recovery,
  Registration,
  Settings,
  Verification,
} from "@ory/elements-react/theme"
import type {
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  SettingsFlow,
  VerificationFlow,
} from "@ory/client-fetch"
import type {
  OrySuccessEvent,
  OryValidationErrorEvent,
  OryErrorEvent,
} from "@ory/elements-react"
import { trackEvent } from "@/lib/matomo"
import config from "@/ory.config"
import type { ComponentProps } from "react"

type OryFlowWithMatomoProps =
  | {
      flowType: "login"
      flow: LoginFlow
      components?: ComponentProps<typeof Login>["components"]
    }
  | {
      flowType: "registration"
      flow: RegistrationFlow
      components?: ComponentProps<typeof Registration>["components"]
    }
  | {
      flowType: "recovery"
      flow: RecoveryFlow
      components?: ComponentProps<typeof Recovery>["components"]
    }
  | {
      flowType: "verification"
      flow: VerificationFlow
      components?: ComponentProps<typeof Verification>["components"]
    }
  | {
      flowType: "settings"
      flow: SettingsFlow
      components?: ComponentProps<typeof Settings>["components"]
    }

export default function OryFlowWithMatomo(props: OryFlowWithMatomoProps) {
  const { flowType, flow, components } = props
  const onSuccess = (event: OrySuccessEvent) => {
    trackEvent(
      "auth",
      `${flowType}_success`,
      "method" in event ? event.method : undefined,
    )
  }
  const onValidationError = (event: OryValidationErrorEvent) => {
    trackEvent("auth", `${flowType}_validation_error`, event.flow.id)
  }
  const onError = (event: OryErrorEvent) => {
    trackEvent("auth", `${flowType}_error`, event.type)
  }
  const common = { config, components, onSuccess, onValidationError }

  switch (flowType) {
    case "login":
      return <Login flow={flow} onError={onError} {...common} />
    case "registration":
      return <Registration flow={flow} onError={onError} {...common} />
    case "recovery":
      return <Recovery flow={flow} onError={onError} {...common} />
    case "verification":
      return <Verification flow={flow} onError={onError} {...common} />
    case "settings":
      return (
        <Settings
          flow={flow}
          // Settings extends div props, so onError must be cast to satisfy
          // the intersection of OryErrorHandler & ReactEventHandler<HTMLDivElement>.
          onError={onError as ComponentProps<typeof Settings>["onError"]}
          {...common}
        />
      )
  }
}
