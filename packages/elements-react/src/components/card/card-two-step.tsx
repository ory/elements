// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType } from "@ory/client-fetch"
import { MethodActiveForm } from "./two-step/state-method-active"
import { ProvideIdentifierForm } from "./two-step/state-provide-identifier"
import { SelectMethodForm } from "./two-step/state-select-method"
import { OrySettingsCard, useOryFlow } from "@ory/elements-react"

/**
 * The `OrySelfServiceFlowCard` component is an umbrella component that can render the self-service flows.
 *
 * Note: prefer using the {@link @ory/elements-react/theme!Login | <Login /> component}, etc. directly instead of this component.
 *
 * It renders different forms based on the current flow state, such as providing an identifier,
 * entering a password or one time code or selecting a method for authentication.
 *
 * The component must be use within an {@link OryProvider} that provides the flow context and components to use.
 *
 * @example
 * ```jsx
 * import { OrySelfServiceFlowCard } from "@ory/elements-react";
 *
 * function MyComponent() {
 *  return <OryProvider ...>
 *    <OrySelfServiceFlowCard />
 *  </OryProvider>;
 * }
 * ```
 *
 * @returns The Ory Two-Step Card component that renders different forms based on the current flow state.
 * @group Components
 */
export function OrySelfServiceFlowCard() {
  const { formState, flowType } = useOryFlow()

  if (flowType === FlowType.Settings) {
    return <OrySettingsCard />
  }

  switch (formState.current) {
    case "provide_identifier":
      return <ProvideIdentifierForm />
    case "select_method":
      return <SelectMethodForm />
    case "method_active":
      return <MethodActiveForm formState={formState} />
  }

  return <>unknown form state: {formState.current}</>
}
