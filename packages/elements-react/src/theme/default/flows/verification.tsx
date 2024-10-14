"use client"
import { FlowType, VerificationFlow } from "@ory/client-fetch"
import {
  OryClientConfiguration,
  OryFlowComponentOverrides,
  OryProvider,
  OryTwoStepCard,
} from "@ory/elements-react"
import merge from "lodash.merge"
import { PropsWithChildren } from "react"
import { OryDefaultComponents } from "../components"

export type VerificationFlowContextProps = {
  flow: VerificationFlow
  components?: OryFlowComponentOverrides
  config: OryClientConfiguration
}

export function Verification({
  flow,
  config,
  children,
  components: flowOverrideComponents,
}: PropsWithChildren<VerificationFlowContextProps>) {
  const components = flowOverrideComponents
    ? merge({}, OryDefaultComponents, flowOverrideComponents)
    : OryDefaultComponents
  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Verification}
      components={components}
    >
      {children ?? <OryTwoStepCard />}
    </OryProvider>
  )
}
