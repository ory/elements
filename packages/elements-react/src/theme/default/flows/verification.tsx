"use client"
import { FlowType, VerificationFlow } from "@ory/client-fetch"
import { PropsWithChildren } from "react"
import { OryDefaultComponents } from "../components"
import { OryFlowComponents } from "../../../types"
import { OryProvider } from "../../../context"
import { OryCard } from "../../../components"
import { OryClientConfiguration } from "../../../util/clientConfiguration"

export type VerificationFlowContextProps = {
  flow: VerificationFlow
  components?: Partial<OryFlowComponents>
  config: OryClientConfiguration
}

export function Verification({
  flow,
  config,
  children,
  components: flowOverrideComponents,
}: PropsWithChildren<VerificationFlowContextProps>) {
  const components = {
    ...OryDefaultComponents,
    ...flowOverrideComponents,
  }
  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Verification}
      components={components}
    >
      {children || <OryCard />}
    </OryProvider>
  )
}
