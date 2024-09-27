"use client"
import { FlowType, SettingsFlow } from "@ory/client-fetch"
import {
  OryClientConfiguration,
  OryFlowComponents,
  OryProvider,
  OryTwoStepCard,
} from "@ory/elements-react"
import { PropsWithChildren } from "react"
import { OryDefaultComponents } from "../components"

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
      {children ?? <OryTwoStepCard />}
    </OryProvider>
  )
}
