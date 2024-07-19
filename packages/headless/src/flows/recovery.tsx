"use client"
import { OryCard } from "../components/card"
import { OryProvider } from "../context"
import { Config, FlowType, OryFlowComponents } from "../types"
import { RecoveryFlow } from "@ory/client-fetch"
import { PropsWithChildren } from "react"

export type FlowContextProps = {
  flow: RecoveryFlow
  components?: Partial<OryFlowComponents>
  config: Config
}

export function Recovery({
  flow,
  config,
  children,
  components,
}: PropsWithChildren<FlowContextProps>) {
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
