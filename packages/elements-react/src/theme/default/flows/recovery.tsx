"use client"
import { FlowType, RecoveryFlow } from "@ory/client-fetch"
import { PropsWithChildren } from "react"
import { OryDefaultComponents } from "../components"
import {
  OryCard,
  OryFlowComponents,
  OryProvider,
  OryClientConfiguration,
} from "@ory/elements-react"

export type RecoveryFlowContextProps = {
  flow: RecoveryFlow
  components?: Partial<OryFlowComponents>
  config: OryClientConfiguration
}

export function Recovery({
  flow,
  config,
  children,
  components: flowOverrideComponents,
}: PropsWithChildren<RecoveryFlowContextProps>) {
  const components = {
    ...OryDefaultComponents,
    ...flowOverrideComponents,
  }
  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Recovery}
      components={components}
    >
      {children ?? <OryCard />}
    </OryProvider>
  )
}
