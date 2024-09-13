"use client"
import { FlowType, LoginFlow } from "@ory/client-fetch"
import { PropsWithChildren } from "react"
import { OryDefaultComponents } from "../components"
import {
  OryFlowComponents,
  OryCard,
  OryClientConfiguration,
  OryProvider,
} from "@ory/elements-react"

export type LoginFlowContextProps = {
  flow: LoginFlow
  components?: Partial<OryFlowComponents>
  config: OryClientConfiguration
}

export function Login({
  flow,
  config,
  children,
  components: flowOverrideComponents,
}: PropsWithChildren<LoginFlowContextProps>) {
  const components = {
    ...OryDefaultComponents,
    ...flowOverrideComponents,
  }
  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Login}
      components={components}
    >
      {children ?? <OryCard />}
    </OryProvider>
  )
}
