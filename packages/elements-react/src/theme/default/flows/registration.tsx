// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { FlowType, RegistrationFlow } from "@ory/client-fetch"
import {
  OryClientConfiguration,
  OryFlowComponentOverrides,
  OryProvider,
  OryTwoStepCard,
} from "@ory/elements-react"
import merge from "lodash.merge"
import { PropsWithChildren } from "react"
import { OryDefaultComponents } from "../components"

type RegistrationFlowContextProps = {
  flow: RegistrationFlow
  components?: OryFlowComponentOverrides
  config: OryClientConfiguration
}

export function Registration({
  flow,
  children,
  components: flowOverrideComponents,
  config,
}: PropsWithChildren<RegistrationFlowContextProps>) {
  const components = flowOverrideComponents
    ? merge({}, OryDefaultComponents, flowOverrideComponents)
    : OryDefaultComponents
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
