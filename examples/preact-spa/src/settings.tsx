// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  gridStyle,
  NodeMessages,
  UserSettingsFlowType,
  UserSettingsCard,
} from "@ory/elements-preact"
import { useCallback, useEffect, useState } from "preact/hooks"
import { sdk, sdkError, getSearchParam } from "./sdk"
import { useLocation } from "wouter-preact"
import { SettingsFlow, UpdateSettingsFlowBody } from "@ory/client"

export const Settings = () => {
  const [flow, setFlow] = useState<SettingsFlow | null>(null)

  const [, setLocation] = useLocation()

  // Get the flow based on the flowId in the URL (.e.g redirect to this page after flow initialized)
  const getFlow = useCallback(
    (flowId: string) =>
      sdk
        // the flow data contains the form fields, error messages and csrf token
        .getSettingsFlow({ id: flowId })
        .then(({ data: flow }) => setFlow(flow))
        .catch(sdkErrorHandler),
    [],
  )

  // initialize the sdkError for generic handling of errors
  const sdkErrorHandler = sdkError(getFlow, setFlow, "/settings", true)

  const createFlow = () => {
    sdk
      // create a new settings flow
      // the flow contains the form fields, error messages and csrf token
      // depending on the Ory Network project settings, the form fields returned may vary
      .createBrowserSettingsFlow()
      .then(({ data: flow }) => {
        setFlow(flow)
      })
      .catch(sdkErrorHandler)
  }

  const onSubmit = (body: UpdateSettingsFlowBody) => {
    // something unexpected went wrong and the flow was not set
    if (!flow) return setLocation("/settings", { replace: true })

    sdk
      .updateSettingsFlow({
        flow: flow.id,
        updateSettingsFlowBody: body,
      })
      .then(({ data: flow }) => {
        setFlow(flow)
      })
      .catch(sdkErrorHandler)
  }

  useEffect(() => {
    // we might redirect to this page after the flow is initialized, so we check for the flowId in the URL
    const flowId = getSearchParam("flow")

    // the flow already exists
    if (flowId) {
      getFlow(flowId).catch(createFlow) // if for some reason the flow has expired, we need to get a new one
      return
    }
    createFlow()
  }, [])

  return flow ? (
    <div className={gridStyle({ gap: 16 })}>
      <NodeMessages uiMessages={flow.ui.messages} />
      {(
        [
          "profile",
          "password",
          "totp",
          "webauthn",
          "lookup_secret",
          "oidc",
        ] as UserSettingsFlowType[]
      ).map((flowType: UserSettingsFlowType, index) => (
        <UserSettingsCard
          key={index}
          flow={flow}
          method={flowType}
          includeScripts={true}
          onSubmit={({ body }) => onSubmit(body as UpdateSettingsFlowBody)}
        />
      ))}
    </div>
  ) : (
    <div>Loading...</div>
  )
}
