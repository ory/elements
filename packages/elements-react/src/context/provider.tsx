// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { PropsWithChildren } from "react"

import { OryFlowComponents } from "../components"
import { OryFlowContainer } from "../util/flowContainer"
import { OryComponentProvider } from "./component"
import { OryFlowProvider } from "./flow-context"
import { IntlProvider } from "./intl-context"
import { OrySDK, OrySDKProvider, useOrySDK } from "./sdk"
import { OryClientConfiguration } from "../util"
import { OryProjectProvider, useOryProject } from "./project"
import { AccountExperienceConfiguration } from "@ory/client-fetch"

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
    <OrySDKProvider config={config.sdk}>
      <OryProjectProvider project={config.project}>
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
      </OryProjectProvider>
    </OrySDKProvider>
  )
}

export type OryElementsConfiguration = {
  sdk: OrySDK
  project: AccountExperienceConfiguration
}

export function useOryElementsConfiguration(): OryElementsConfiguration {
  return {
    sdk: useOrySDK(),
    project: useOryProject(),
  }
}
