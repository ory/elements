"use client"
import { FlowType, RecoveryFlow } from "@ory/client-fetch"
import {
  OryClientConfiguration,
  OryFlowComponentOverrides,
  OryProvider,
  OryTwoStepCard,
} from "@ory/elements-react"
import merge from "lodash.merge"
import { PropsWithChildren } from "react"
import { OryDefaultComponents } from "../components"

export type RecoveryFlowContextProps = {
  flow: RecoveryFlow
  components?: OryFlowComponentOverrides
  config: OryClientConfiguration
}

export function Recovery({
  flow,
  config,
  children,
  components: flowOverrideComponents,
}: PropsWithChildren<RecoveryFlowContextProps>) {
  const components = flowOverrideComponents
    ? merge({}, OryDefaultComponents, flowOverrideComponents)
    : OryDefaultComponents
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
