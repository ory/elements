// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { FlowType, type VerificationFlow } from "@ory/client-fetch"
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
  onSuccess,
  onValidationError,
  onError,
  transientPayload,
}: VerificationFlowContextProps) {
  const components = getOryComponents(flowOverrideComponents)
  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Verification}
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
