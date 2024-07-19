"use client"
import { OryCard } from "../components/card"
import { OryProvider } from "../context"
import { Config, FlowType, OryFlowComponents } from "../types"
import { SettingsFlow } from "@ory/client-fetch"
import { PropsWithChildren } from "react"

export type FlowContextProps = {
  flow: SettingsFlow
  components?: Partial<OryFlowComponents>
  config: Config
}

export function Settings({
  flow,
  config,
  children,
  components,
}: PropsWithChildren<FlowContextProps>) {
  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Settings}
      components={components}
    >
      {children || <OryCard />}
    </OryProvider>
  )
}
