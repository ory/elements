// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { FlowType, LoginFlow } from "@ory/client-fetch"
import {
  OryClientConfiguration,
  OryFlowComponents,
  OryProvider,
  OryTwoStepCard,
} from "@ory/elements-react"
import { PropsWithChildren } from "react"
import { OryDefaultComponents } from "../components"

export type LoginFlowContextProps = {
  flow: LoginFlow
  components?: Partial<OryFlowComponents>
  config: OryClientConfiguration
}

export function Login({
  flow,
  config,
  children,
  components: flowOverrideComponents,
}: PropsWithChildren<LoginFlowContextProps>) {
  const components = {
    ...OryDefaultComponents,
    ...flowOverrideComponents,
  }
  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Login}
      components={components}
    >
      {children ?? <OryTwoStepCard />}
    </OryProvider>
  )
}
