// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { FlowType, RecoveryFlow } from "@ory/client-fetch"
import {
  OryClientConfiguration,
  OryFlowComponents,
  OryProvider,
  OryTwoStepCard,
} from "@ory/elements-react"
import { PropsWithChildren } from "react"
import { OryDefaultComponents } from "../components"

export type RecoveryFlowContextProps = {
  flow: RecoveryFlow
  components?: Partial<OryFlowComponents>
  config: OryClientConfiguration
}

export function Recovery({
  flow,
  config,
  children,
  components: flowOverrideComponents,
}: PropsWithChildren<RecoveryFlowContextProps>) {
  const components = {
    ...OryDefaultComponents,
    ...flowOverrideComponents,
  }
  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Recovery}
      components={components}
    >
      {children ?? <OryTwoStepCard />}
    </OryProvider>
  )
}
