// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { FlowType, RecoveryFlow } from "@ory/client-fetch"
import {
  OryClientConfiguration,
  OryFlowComponentOverrides,
  OryProvider,
  OrySelfServiceFlowCard,
} from "@ory/elements-react"
import { getOryComponents } from "../components"

/**
 * Props for the Recovery component.
 * @inline
 * @hidden
 */
export type RecoveryFlowContextProps = {
  /**
   * The recovery flow object containing the state and data for the recovery process.
   */
  flow: RecoveryFlow
  /**
   * Optional components to override the default ones.
   *
   * This allows you to customize the appearance and behavior of the recovery flow.
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
 * The `Recovery` component is used to render the recovery flow in Ory Elements.
 *
 * @param props - The props for the Recovery component.
 * @returns the recovery flow component.
 * @group Components
 * @category Flows
 */
export function Recovery({
  flow,
  config,
  children,
  components: flowOverrideComponents,
}: RecoveryFlowContextProps) {
  const components = getOryComponents(flowOverrideComponents)
  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Recovery}
      components={components}
    >
      {children ?? <OrySelfServiceFlowCard />}
    </OryProvider>
  )
}
