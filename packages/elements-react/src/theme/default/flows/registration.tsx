"use client"
import { FlowType, RegistrationFlow } from "@ory/client-fetch"
import { PropsWithChildren } from "react"
import { OryDefaultComponents } from "../components"
import { OryFlowComponents } from "../../../types"
import { OryProvider } from "../../../context"
import { OryCard } from "../../../components"
import { OryClientConfiguration } from "../../../util/clientConfiguration"

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
