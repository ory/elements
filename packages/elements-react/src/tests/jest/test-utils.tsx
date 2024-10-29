// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { render, RenderOptions } from "@testing-library/react"
import { merge } from "lodash"
import { ComponentProps, PropsWithChildren, ReactElement } from "react"
import { OryFlowComponentOverrides } from "../../components"
import { OryProvider } from "../../context"
import { OryComponentProvider } from "../../context/component"
import { OryDefaultComponents } from "../../theme/default"
import { OryClientConfiguration, OryFlowContainer } from "../../util"
export const defaultConfiguration: OryClientConfiguration = {
  name: "test",
  project: {
    login_ui_url: "http://localhost:4455/login",
    recovery_ui_url: "http://localhost:4455/recovery",
    registration_ui_url: "http://localhost:4455/registration",
    verification_ui_url: "http://localhost:4455/verification",
    recovery_enabled: true,
    registration_enabled: true,
    verification_enabled: true,
  },
  sdk: {
    url: "http://localhost:4455",
  },
}

type ComponetOverrider = { components?: OryFlowComponentOverrides }

const ComponentProvider = ({
  children,
  components,
}: PropsWithChildren<ComponetOverrider>) => (
  <OryComponentProvider
    components={merge({}, OryDefaultComponents, components)}
  >
    {children}
  </OryComponentProvider>
)

export const renderWithComponents = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> &
    ComponentProps<typeof ComponentProvider>,
) => render(ui, { wrapper: ComponentProvider, ...options })

type FlowProviderProps = ComponetOverrider & {
  flow: OryFlowContainer
}

const FlowProvider = ({
  children,
  flow,
  components,
}: PropsWithChildren<FlowProviderProps>) => {
  console.log(flow)
  return (
    <OryProvider
      components={merge({}, OryDefaultComponents, components)}
      flow={flow.flow}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      flowType={flow.flowType as any}
      config={defaultConfiguration}
    >
      {children}
    </OryProvider>
  )
}

export const renderWithFlow = (
  ui: ReactElement,
  flow: OryFlowContainer,
  options: Omit<RenderOptions, "wrapper"> & ComponetOverrider,
) =>
  render(ui, {
    wrapper: ({ children }: PropsWithChildren) => (
      <FlowProvider flow={flow} components={options.components}>
        {children}
      </FlowProvider>
    ),
    ...options,
  })
