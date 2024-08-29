"use client"
import { FlowType, RecoveryFlow } from "@ory/client-fetch"
import { PropsWithChildren } from "react"
import { OryDefaultComponents } from "../components"
import { OryFlowComponents } from "../../../types"
import { OryProvider } from "../../../context"
import { OryClientConfiguration } from "../../../util/clientConfiguration"
import { OryTwoStepCard } from "../../../components/card/card-two-step"

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
      {children ?? <OryTwoStepCard />}
    </OryProvider>
  )
}
