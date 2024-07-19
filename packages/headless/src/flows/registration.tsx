"use client"
import { OryCard } from "../components/card"
import { OryProvider } from "../context"
import { Config, FlowType, OryFlowComponents } from "../types"
import { RegistrationFlow } from "@ory/client-fetch"
import { PropsWithChildren } from "react"

type FlowContextProps = {
  flow: RegistrationFlow
  components?: Partial<OryFlowComponents>
  config: Config
}

export function Registration({
  flow,
  children,
  components,
  config,
}: PropsWithChildren<FlowContextProps>) {
  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Registration}
      components={components}
    >
      {children || <OryCard />}
    </OryProvider>
  )
}
