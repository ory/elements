// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { FlowType, SettingsFlow } from "@ory/client-fetch"
import {
  OryClientConfiguration,
  OryFlowComponentOverrides,
  OryPageHeader,
  OryProvider,
  OrySettingsCard,
} from "@ory/elements-react"
import { getOryComponents } from "../components"

/**
 * Props for the Settings component.
 *
 * @inline
 * @hidden
 */
export type SettingsFlowContextProps = {
  /**
   * The settings flow object containing the state and data for the settings process.
   */
  flow: SettingsFlow
  /**
   * Optional components to override the default ones.
   *
   * This allows you to customize the appearance and behavior of the settings flow.
   */
  components?: OryFlowComponentOverrides
  /**
   * The Ory client configuration object.
   *
   * This object contains the configuration for the Ory client, such as the base URL and other settings.
   */
  config: OryClientConfiguration
  /**
   * Optional children to render
   *
   * If not provided, the default OrySettingsCard will be rendered.
   */
  children?: React.ReactNode
}

/**
 * The `Settings` component is used to render the settings flow in Ory Elements.
 *
 * It provides the necessary context and components for the settings flow, allowing you to customize the appearance and behavior of the settings form.
 *
 * @param props - The props for the Settings component.
 * @group Components
 * @category Flows
 */
export function Settings({
  flow,
  config,
  children,
  components: flowOverrideComponents,
}: SettingsFlowContextProps) {
  const components = getOryComponents(flowOverrideComponents)

  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Settings}
      components={components}
    >
      {children ?? (
        <>
          <OryPageHeader />
          <OrySettingsCard />
        </>
      )}
    </OryProvider>
  )
}
