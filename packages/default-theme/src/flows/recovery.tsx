"use client"
import { FlowType, OryClientConfiguration } from "@ory/client-helpers"
import { OryCard } from "@ory/react-headless/src/components/card"
import { OryProvider } from "@ory/react-headless/src/context"
import { OryFlowComponents } from "@ory/react-headless/src/types"
import { RecoveryFlow } from "@ory/client-fetch"
import { PropsWithChildren } from "react"
import { OryDefaultComponents } from ".."

export type FlowContextProps = {
  flow: RecoveryFlow
  components?: Partial<OryFlowComponents>
  config: OryClientConfiguration
}

export function Recovery({
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
      flowType={FlowType.Recovery}
      components={components}
    >
      {children || <OryCard />}
    </OryProvider>
  )
}
