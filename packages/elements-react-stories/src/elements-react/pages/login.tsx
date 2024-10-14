// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { FlowType, LoginFlow } from "@ory/client-fetch"
import {
  OryCard,
  OryClientConfiguration,
  OryFlowComponents,
  OryProvider,
} from "@ory/elements-react"
import { OryDefaultComponents } from "@ory/elements-react/theme"
import { PropsWithChildren } from "react"

export type FlowContextProps = {
  flow: LoginFlow
  components?: Partial<OryFlowComponents>
  config: OryClientConfiguration
}

export function Login({
  flow,
  config,
  children,
  components,
}: PropsWithChildren<FlowContextProps>) {
  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Login}
      components={{ ...OryDefaultComponents, ...components }}
    >
      {children || <OryCard />}
    </OryProvider>
  )
}
