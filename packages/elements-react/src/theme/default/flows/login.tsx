// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { FlowType, LoginFlow } from "@ory/client-fetch"
import {
  OryClientConfiguration,
  OryFlowComponentOverrides,
  OryProvider,
  OrySelfServiceFlowCard,
} from "@ory/elements-react"
import { getOryComponents } from "../components"

/**
 * Props for the Login component.
 *
 * @inline
 * @hidden
 */
export type LoginFlowContextProps = {
  /**
   * The login flow object containing the state and data for the login process.
   */
  flow: LoginFlow
  /**
   * Optional components to override the default ones.
   *
   * This allows you to customize the appearance and behavior of the login flow.
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
   * If not provided, the default OrySelfServiceFlowCard will be rendered.
   */
  children?: React.ReactNode
}

/**
 * The `Login` component is used to render the login flow in Ory Elements.
 *
 * It provides the necessary context and components for the login flow, allowing you to customize the appearance and behavior of the login form.
 *
 * @param props - The props for the Login component.
 * @group Components
 * @category Flows
 */
export function Login({
  flow,
  config,
  children,
  components: flowOverrideComponents,
}: LoginFlowContextProps) {
  const components = getOryComponents(flowOverrideComponents)
  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Login}
      components={components}
    >
      {children ?? <OrySelfServiceFlowCard />}
    </OryProvider>
  )
}
