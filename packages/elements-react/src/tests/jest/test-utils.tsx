// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { render, RenderOptions } from "@testing-library/react"
import { ComponentProps, PropsWithChildren, ReactElement } from "react"
import { OryFlowComponentOverrides } from "../../components"
import { OryComponentProvider } from "../../context/component"
import { getOryComponents } from "../../theme/default"
import { OryClientConfiguration } from "../../util"

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
    default_locale: "en",
    locale_behavior: "respect_accept_language",
  },
  sdk: {
    url: "http://localhost:4455",
  },
}

type ComponentOverrider = { components?: OryFlowComponentOverrides }

const ComponentProvider = ({
  children,
  components,
}: PropsWithChildren<ComponentOverrider>) => (
  <OryComponentProvider components={getOryComponents(components)}>
    {children}
  </OryComponentProvider>
)

export const renderWithComponents = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> &
    ComponentProps<typeof ComponentProvider>,
) => render(ui, { wrapper: ComponentProvider, ...options })
