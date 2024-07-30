"use client"
import { SettingsFlow } from "@ory/client-fetch"
import { FlowType, OryClientConfiguration } from "@ory/client-helpers"
import { PropsWithChildren } from "react"
import { OryCard } from "@ory/react-headless/src/components/card"
import { OryProvider } from "@ory/react-headless/src/context"
import { OryFlowComponents } from "@ory/react-headless/src/types"
import { OryDefaultComponents } from ".."

export type FlowContextProps = {
  flow: SettingsFlow
  components?: Partial<OryFlowComponents>
  config: OryClientConfiguration
}

export function Settings({
  flow,
  config,
  children,
  components: flowOverrideComponents,
}: PropsWithChildren<FlowContextProps>) {
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
