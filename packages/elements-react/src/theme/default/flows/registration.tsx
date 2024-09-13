"use client"
import { FlowType, RegistrationFlow } from "@ory/client-fetch"
import { PropsWithChildren } from "react"
import { OryDefaultComponents } from "../components"
import {
  OryClientConfiguration,
  OryFlowComponents,
  OryCard,
  OryProvider,
} from "@ory/elements-react"

type RegistrationFlowContextProps = {
  flow: RegistrationFlow
  components?: Partial<OryFlowComponents>
  config: OryClientConfiguration
}

export function Registration({
  flow,
  children,
  components: flowOverrideComponents,
  config,
}: PropsWithChildren<RegistrationFlowContextProps>) {
  const components = {
    ...OryDefaultComponents,
    ...flowOverrideComponents,
  }
  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Registration}
      components={components}
    >
      {children ?? <OryCard />}
    </OryProvider>
  )
}
