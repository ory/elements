// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, LoginFlowFromJSON } from "@ory/client-fetch"
import { render, RenderOptions } from "@testing-library/react"
import { PropsWithChildren, ReactElement } from "react"
import dummyFlow from "../../../.stub-responses/login/1fa/none/initial-form.json"
import { OryFlowComponentOverrides } from "../../components"
import { OryComponentProvider } from "../../context/component"
import { OryFlowProvider } from "../../context/flow-context"
import { getOryComponents } from "../../theme/default"
import { OryClientConfiguration, OryFlowContainer } from "../../util"
import { OryConfigurationProvider } from "../../context"
import { OryFormProvider } from "../../components/form/form-provider"

export const defaultConfiguration: OryClientConfiguration = {
  project: {
    login_ui_url: "http://localhost:4455/login",
    recovery_ui_url: "http://localhost:4455/recovery",
    registration_ui_url: "http://localhost:4455/registration",
    verification_ui_url: "http://localhost:4455/verification",
    recovery_enabled: true,
    registration_enabled: true,
    verification_enabled: true,
    name: "test",
    default_redirect_url: "http://localhost:4455",
    error_ui_url: "http://localhost:4455/error",
    settings_ui_url: "http://localhost:4455/settings",
  },
  sdk: {
    url: "http://localhost:4455",
  },
}

type OryProviderProps = {
  components?: OryFlowComponentOverrides
  flow?: OryFlowContainer
} & PropsWithChildren

const OryProvider = ({ children, components, flow }: OryProviderProps) => (
  <OryFlowProvider
    {...(flow ?? {
      flowType: FlowType.Login,
      flow: LoginFlowFromJSON(dummyFlow),
    })}
  >
    <OryComponentProvider components={getOryComponents(components)}>
      <OryConfigurationProvider {...defaultConfiguration}>
        <OryFormProvider>{children}</OryFormProvider>
      </OryConfigurationProvider>
    </OryComponentProvider>
  </OryFlowProvider>
)

export const renderWithOryElements = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & OryProviderProps,
) =>
  render(ui, {
    wrapper: OryProvider,
    ...options,
  })
