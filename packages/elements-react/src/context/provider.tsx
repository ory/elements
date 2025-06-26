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

/**
 * Props type for the OryProvider component.
 */
export type OryProviderProps = {
  /**
   * The components to use for rendering Ory flows.
   * You can provide custom components to override the default Ory components.
   */
  components: OryFlowComponents
  /**
   * The Ory client configuration.
   * This includes the SDK and project configuration.
   */
  config: OryClientConfiguration
} & OryFlowContainer &
  PropsWithChildren

/**
 * OryProvider is a React component that provides the necessary context for rendering Ory flows.
 *
 * It wraps the application in several context providers, including {@link OryConfigurationProvider}.
 *
 * You can use this component to set up the Ory SDK, provide custom translations, and specify the components to use for rendering Ory flows.
 *
 * @example
 * ```tsx
 * import { OryProvider, LoginFlow, OryFlowComponents, OryClientConfiguration } from "@ory/elements-react";
 *
 *
 * export type Props = {
 *   flow: LoginFlow
 *   components: OryFlowComponents
 *   config: OryClientConfiguration
 * }
 *
 * function App({
 *   flow,
 *   config,
 *   children,
 *   components,
 * }: PropsWithChildren<Props>) {
 *   return (
 *     <OryProvider
 *       config={config}
 *       flow={flow}
 *       flowType={FlowType.Login}
 *       components={components}
 *     >
 *       {children}
 *     </OryProvider>
 *   )
 * }
 *
 * ```
 *
 * @param props - The properties for the OryProvider component.
 * @returns
 * @group Components
 */
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
