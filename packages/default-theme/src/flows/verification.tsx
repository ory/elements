"use client"
import { VerificationFlow } from "@ory/client-fetch"
import { FlowType, OryClientConfiguration } from "@ory/client-helpers"
import { PropsWithChildren } from "react"
import { OryDefaultComponents } from "../components"
import { OryCard, OryFlowComponents, OryProvider } from "@ory/react-headless"

export type VerificationFlowContextProps = {
  flow: VerificationFlow
  components?: Partial<OryFlowComponents>
  config: OryClientConfiguration
}

export function Verification({
  flow,
  config,
  children,
  components: flowOverrideComponents,
}: PropsWithChildren<VerificationFlowContextProps>) {
  const components = {
    ...OryDefaultComponents,
    ...flowOverrideComponents,
  }
  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Verification}
      components={components}
    >
      {children || <OryCard />}
    </OryProvider>
  )
}
