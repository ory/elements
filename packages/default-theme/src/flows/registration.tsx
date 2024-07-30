"use client"
import { FlowType, OryClientConfiguration } from "@ory/client-helpers"
import { OryCard } from "@ory/react-headless/src/components/card"
import { OryProvider } from "@ory/react-headless/src/context"
import { OryFlowComponents } from "@ory/react-headless/src/types"
import { RegistrationFlow } from "@ory/client-fetch"
import { PropsWithChildren } from "react"
import { OryDefaultComponents } from ".."

type FlowContextProps = {
  flow: RegistrationFlow
  components?: Partial<OryFlowComponents>
  config: OryClientConfiguration
}

export function Registration({
  flow,
  children,
  components: flowOverrideComponents,
  config,
}: PropsWithChildren<FlowContextProps>) {
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
      {children || <OryCard />}
    </OryProvider>
  )
}
