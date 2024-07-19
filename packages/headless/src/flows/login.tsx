"use client"
import { OryCard } from "../components/card"
import { OryProvider } from "../context"
import { Config, FlowType, OryFlowComponents } from "../types"
import { LoginFlow } from "@ory/client-fetch"
import { PropsWithChildren } from "react"

export type FlowContextProps = {
  flow: LoginFlow
  components?: Partial<OryFlowComponents>
  config: Config
}

export function Login({
  flow,
  config,
  children,
  components,
}: PropsWithChildren<FlowContextProps>) {
  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Login}
      components={components}
    >
      {children || <OryCard />}
    </OryProvider>
  )
}
