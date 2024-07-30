"use client"
import { SettingsFlow } from "@ory/client-fetch"
import { FlowType, OryClientConfiguration } from "@ory/client-helpers"
import { PropsWithChildren } from "react"
import { OryDefaultComponents } from "../components"
import { OryCard, OryFlowComponents, OryProvider } from "@ory/react-headless"

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
      {children || <OryCard />}
    </OryProvider>
  )
}
