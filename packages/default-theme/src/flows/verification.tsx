"use client"
import { VerificationFlow } from "@ory/client-fetch"
import { FlowType, OryClientConfiguration } from "@ory/client-helpers"
import { OryCard } from "@ory/react-headless/src/components/card"
import { OryProvider } from "@ory/react-headless/src/context"
import { OryFlowComponents } from "@ory/react-headless/src/types"
import { PropsWithChildren } from "react"
import { OryDefaultComponents } from ".."

export type FlowContextProps = {
  flow: VerificationFlow
  components?: Partial<OryFlowComponents>
  config: OryClientConfiguration
}

export function Verification({
  flow,
  config,
  children,
  components: flowOverrideComponents,
}: PropsWithChildren<FlowContextProps>) {
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
