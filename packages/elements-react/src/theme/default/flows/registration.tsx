// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { FlowType, RegistrationFlow } from "@ory/client-fetch"
import {
  OryClientConfiguration,
  OryFlowComponentOverrides,
  OryProvider,
  OrySelfServiceFlowCard,
} from "@ory/elements-react"
import { getOryComponents } from "../components"

/**
 * Props for the Registration component.
 *
 * @inline
 * @hidden
 */
type RegistrationFlowContextProps = {
  /**
   * The registration flow object containing the state and data for the registration process.
   */
  flow: RegistrationFlow

  /**
   * Optional components to override the default ones.
   *
   * This allows you to customize the appearance and behavior of the registration flow.
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
 * The `Registration` component is used to render the registration flow in Ory Elements.
 *
 * @param props - The props for the Registration component.
 * @returns
 * @group Components
 * @category Flows
 */
export function Registration({
  flow,
  children,
  components: flowOverrideComponents,
  config,
}: RegistrationFlowContextProps) {
  const components = getOryComponents(flowOverrideComponents)
  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Registration}
      components={components}
    >
      {children ?? <OrySelfServiceFlowCard />}
    </OryProvider>
  )
}
