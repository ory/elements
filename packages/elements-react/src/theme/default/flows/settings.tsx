"use client"
import { SettingsFlow } from "@ory/client-fetch"
import { FlowType, OryClientConfiguration } from "@ory/client-helpers"
import { PropsWithChildren } from "react"
import { OryDefaultComponents } from "../components"
import { OryFlowComponents } from "../../../types"
import { OryProvider } from "../../../context"
import { OryCard } from "../../../components"

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
