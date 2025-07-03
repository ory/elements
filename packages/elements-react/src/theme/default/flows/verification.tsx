// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { FlowType, VerificationFlow } from "@ory/client-fetch"
import {
  OryClientConfiguration,
  OryFlowComponentOverrides,
  OryProvider,
  OrySelfServiceFlowCard,
} from "@ory/elements-react"
import { getOryComponents } from "../components"

/**
 * Props for the Verification component.
 *
 * @inline
 * @hidden
 */
export type VerificationFlowContextProps = {
  /**
   * The verification flow object containing the state and data for the verification process.
   */
  flow: VerificationFlow
  /**
   * Optional components to override the default ones.
   *
   * This allows you to customize the appearance and behavior of the verification flow.
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
 * The `Verification` component is used to render the verification flow in Ory Elements.
 *
 * It provides the necessary context and components for the verification flow, allowing you to customize the appearance and behavior of the verification form.
 *
 * @param props - The props for the Verification component.
 * @group Components
 * @category Flows
 */
export function Verification({
  flow,
  config,
  children,
  components: flowOverrideComponents,
}: VerificationFlowContextProps) {
  const components = getOryComponents(flowOverrideComponents)
  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Verification}
      components={components}
    >
      {children ?? <OrySelfServiceFlowCard />}
    </OryProvider>
  )
}
