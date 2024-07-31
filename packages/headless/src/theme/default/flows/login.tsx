"use client"
import { FlowType, OryClientConfiguration } from "@ory/client-helpers"
import { LoginFlow } from "@ory/client-fetch"
import { PropsWithChildren } from "react"
import { OryDefaultComponents } from "../components"
import { OryFlowComponents } from "../../../types"
import { OryProvider } from "../../../context"
import { OryCard } from "../../../components"

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
      {children || <OryCard />}
    </OryProvider>
  )
}
