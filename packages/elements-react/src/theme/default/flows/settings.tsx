"use client"
import { FlowType, SettingsFlow } from "@ory/client-fetch"
import { PropsWithChildren } from "react"
import { OryDefaultComponents } from "../components"
import {
  OryFlowComponents,
  OryClientConfiguration,
  OryProvider,
  OryCard,
} from "@ory/elements-react"

export type SettingsFlowContextProps = {
  flow: SettingsFlow
  components?: Partial<OryFlowComponents>
  config: OryClientConfiguration
}

export function Settings({
  flow,
  config,
  children,
  components: flowOverrideComponents,
}: PropsWithChildren<SettingsFlowContextProps>) {
  const components = {
    ...OryDefaultComponents,
    ...flowOverrideComponents,
  }
  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Settings}
      components={components}
    >
      {children ?? <OryCard />}
    </OryProvider>
  )
}
