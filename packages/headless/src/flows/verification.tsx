"use client"
import { OryCard } from "../components/card"
import { OryProvider } from "../context"
import { Config, FlowType, OryFlowComponents } from "../types"
import { VerificationFlow } from "@ory/client-fetch"
import { PropsWithChildren } from "react"

export type FlowContextProps = {
  flow: VerificationFlow
  components?: Partial<OryFlowComponents>
  config: Config
}

export function Verification({
  flow,
  config,
  children,
  components,
}: PropsWithChildren<FlowContextProps>) {
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
