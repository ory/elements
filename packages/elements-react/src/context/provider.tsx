// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { PropsWithChildren } from "react"

import { OryFlowComponents } from "../components"
import { OryClientConfiguration } from "../util"
import {
  OryErrorHandler,
  OrySuccessHandler,
  OryValidationErrorHandler,
} from "../util/events"
import { OryFlowContainer } from "../util/flowContainer"
import { OryTransientPayload } from "../util/transientPayload"
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
  /**
   * Optional callback invoked on successful flow completion.
   *
   * Use this for session stitching and post-authentication analytics.
   *
   * @example
   * ```tsx
   * <OryProvider
   *   config={config}
   *   flow={flow}
   *   flowType={FlowType.Login}
   *   components={components}
   *   onSuccess={async (event) => {
   *     if (event.flowType === FlowType.Login) {
   *       await mixpanel.identify(event.session.identity.id)
   *     }
   *   }}
   * />
   * ```
   */
  onSuccess?: OrySuccessHandler

  /**
   * Optional callback invoked when the flow returns validation errors.
   *
   * Use this to track form friction in your analytics pipeline.
   *
   * @example
   * ```tsx
   * onValidationError={(event) => {
   *   analytics.track("validation_error", { flow: event.flow.id })
   * }}
   * ```
   */
  onValidationError?: OryValidationErrorHandler

  /**
   * Optional callback invoked when a flow error occurs (expired, security violation, etc.).
   *
   * Use this to track error rates and detect integration issues.
   *
   * @example
   * ```tsx
   * onError={(event) => {
   *   if (event.type === "flow_expired") {
   *     analytics.track("flow_expired", { flowType: event.flowType })
   *   }
   * }}
   * ```
   */
  onError?: OryErrorHandler

  /**
   * Optional transient payload to include in all flow submissions.
   *
   * Accepts a static object or a function that receives form values at
   * submission time and returns the payload. Values are merged with any
   * transient payload fields from UI nodes (e.g., captcha), with
   * user-provided values taking priority.
   *
   * @example
   * ```tsx
   * <OryProvider
   *   config={config}
   *   flow={flow}
   *   flowType={FlowType.Registration}
   *   components={components}
   *   transientPayload={{ locale: "en-US", referral_code: "ABC123" }}
   * />
   * ```
   *
   * @example
   * ```tsx
   * <OryProvider
   *   config={config}
   *   flow={flow}
   *   flowType={FlowType.Registration}
   *   components={components}
   *   transientPayload={(formValues) => ({
   *     signup_method: String(formValues.method ?? "unknown"),
   *   })}
   * />
   * ```
   */
  transientPayload?: OryTransientPayload
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
  onSuccess,
  onValidationError,
  onError,
  transientPayload,
  ...oryFlowProps
}: OryProviderProps) {
  return (
    <OryConfigurationProvider sdk={config.sdk} project={config.project}>
      <IntlProvider
        locale={config.intl?.locale ?? "en"}
        customTranslations={config.intl?.customTranslations}
      >
        <OryFlowProvider
          {...oryFlowProps}
          onSuccess={onSuccess}
          onValidationError={onValidationError}
          onError={onError}
          transientPayload={transientPayload}
        >
          <OryComponentProvider components={Components}>
            {children}
          </OryComponentProvider>
        </OryFlowProvider>
      </IntlProvider>
    </OryConfigurationProvider>
  )
}
