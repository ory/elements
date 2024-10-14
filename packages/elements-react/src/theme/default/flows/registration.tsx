// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { FlowType, RegistrationFlow } from "@ory/client-fetch"
import {
  OryClientConfiguration,
  OryFlowComponents,
  OryProvider,
  OryTwoStepCard,
} from "@ory/elements-react"
import { PropsWithChildren } from "react"
import { OryDefaultComponents } from "../components"

type RegistrationFlowContextProps = {
  flow: RegistrationFlow
  components?: Partial<OryFlowComponents>
  config: OryClientConfiguration
}

export function Registration({
  flow,
  children,
  components: flowOverrideComponents,
  config,
}: PropsWithChildren<RegistrationFlowContextProps>) {
  const components = {
    ...OryDefaultComponents,
    ...flowOverrideComponents,
  }
  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Registration}
      components={components}
    >
      {children ?? <OryTwoStepCard />}
    </OryProvider>
  )
}
