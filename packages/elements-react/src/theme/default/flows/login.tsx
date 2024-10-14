"use client"
import { FlowType, LoginFlow } from "@ory/client-fetch"
import {
  OryClientConfiguration,
  OryFlowComponentOverrides,
  OryProvider,
  OryTwoStepCard,
} from "@ory/elements-react"
import merge from "lodash.merge"
import { PropsWithChildren } from "react"
import { OryDefaultComponents } from "../components"

export type LoginFlowContextProps = {
  flow: LoginFlow
  components?: OryFlowComponentOverrides
  config: OryClientConfiguration
}

export function Login({
  flow,
  config,
  children,
  components: flowOverrideComponents,
}: PropsWithChildren<LoginFlowContextProps>) {
  const components = flowOverrideComponents
    ? merge({}, OryDefaultComponents, flowOverrideComponents)
    : OryDefaultComponents
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
