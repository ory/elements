// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { PropsWithChildren } from "react"

import { OryFlowComponents } from "../components"
import { OryClientConfiguration } from "../util"
import { OryFlowContainer } from "../util/flowContainer"
import { OryComponentProvider } from "./component"
import { OryConfigurationProvider } from "./config"
import { OryFlowProvider } from "./flow-context"
import { IntlProvider } from "./intl-context"

export type OryProviderProps = {
  components: OryFlowComponents
  config: OryClientConfiguration
} & OryFlowContainer &
  PropsWithChildren

export function OryProvider({
  children,
  components: Components,
  config,
  ...oryFlowProps
}: OryProviderProps) {
  return (
    <OryConfigurationProvider sdk={config.sdk} project={config.project}>
      <IntlProvider
        locale={config.intl?.locale ?? "en"}
        customTranslations={config.intl?.customTranslations}
      >
        <OryFlowProvider {...oryFlowProps}>
          <OryComponentProvider components={Components}>
            {children}
          </OryComponentProvider>
        </OryFlowProvider>
      </IntlProvider>
    </OryConfigurationProvider>
  )
}
