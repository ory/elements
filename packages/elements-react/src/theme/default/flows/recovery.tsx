// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { FlowType, type RecoveryFlow } from "@ory/client-fetch"
import {
  type OryClientConfiguration,
  type OryErrorHandler,
  type OryFlowComponentOverrides,
  OryProvider,
  OrySelfServiceFlowCard,
  type OrySuccessHandler,
  type OryTransientPayload,
  type OryValidationErrorHandler,
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

  /**
   * Optional callback invoked on successful flow completion.
   *
   * @see {@link OrySuccessHandler}
   */
  onSuccess?: OrySuccessHandler

  /**
   * Optional callback invoked when the flow returns validation errors.
   *
   * @see {@link OryValidationErrorHandler}
   */
  onValidationError?: OryValidationErrorHandler

  /**
   * Optional callback invoked on flow-level errors.
   *
   * @see {@link OryErrorHandler}
   */
  onError?: OryErrorHandler

  /**
   * Optional transient payload to include in flow submissions.
   *
   * Accepts a static object or a function that receives form values at
   * submission time and returns the payload.
   *
   * @see {@link OryTransientPayload}
   */
  transientPayload?: OryTransientPayload
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
  onSuccess,
  onValidationError,
  onError,
  transientPayload,
}: RecoveryFlowContextProps) {
  const components = getOryComponents(flowOverrideComponents)
  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Recovery}
      components={components}
      onSuccess={onSuccess}
      onValidationError={onValidationError}
      onError={onError}
      transientPayload={transientPayload}
    >
      {children ?? <OrySelfServiceFlowCard />}
    </OryProvider>
  )
}
