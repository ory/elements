"use client"
import { FlowType, RegistrationFlow } from "@ory/client-fetch"
import { PropsWithChildren } from "react"
import { OryDefaultComponents } from "../components"
import { OryFlowComponents } from "../../../types"
import { OryProvider } from "../../../context"
import { OryClientConfiguration } from "../../../util/clientConfiguration"
import { OryTwoStepCard } from "../../../components/card/card-two-step"

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
      {children ?? <OryTwoStepCard />}
    </OryProvider>
  )
}
