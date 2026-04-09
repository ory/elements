// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { FlowType, RegistrationFlow } from "@ory/client-fetch"
import {
  OryClientConfiguration,
  OryErrorHandler,
  OryFlowComponentOverrides,
  OryProvider,
  OrySelfServiceFlowCard,
  OrySuccessHandler,
  OryTransientPayload,
  OryValidationErrorHandler,
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
  onSuccess,
  onValidationError,
  onError,
  transientPayload,
}: RegistrationFlowContextProps) {
  const components = getOryComponents(flowOverrideComponents)
  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Registration}
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
