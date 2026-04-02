// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { FlowType, LoginFlow } from "@ory/client-fetch"
import {
  OryClientConfiguration,
  OryErrorHandler,
  OryFlowComponentOverrides,
  OryProvider,
  OrySelfServiceFlowCard,
  OrySuccessHandler,
  OryValidationErrorHandler,
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
  onSuccess,
  onValidationError,
  onError,
}: LoginFlowContextProps) {
  const components = getOryComponents(flowOverrideComponents)
  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Login}
      components={components}
      onSuccess={onSuccess}
      onValidationError={onValidationError}
      onError={onError}
    >
      {children ?? <OrySelfServiceFlowCard />}
    </OryProvider>
  )
}
