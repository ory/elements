// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import { getNodeId } from "../../util/sdk-helpers/ui"
import { PropsWithChildren } from "react"
import { useFormContext } from "react-hook-form"
import { useComponents, useOryFlow } from "../../context"
import { OryForm } from "./form"
import { OryFormProvider } from "./form-provider"
import { Node } from "./nodes/node"

export type OryFormSsoRootProps = PropsWithChildren<{
  nodes: UiNode[]
}>

/**
 * Renders the flow's OIDC buttons.
 *
 * @returns a React component that renders the OIDC buttons.
 * @group Components
 */
export function OryFormSsoButtons() {
  const {
    flow: { ui },
  } = useOryFlow()

  // Only get the oidc nodes.
  const filteredNodes = ui.nodes.filter(
    (node) =>
      node.group === UiNodeGroupEnum.Oidc ||
      node.group === UiNodeGroupEnum.Saml,
  )

  const { Form } = useComponents()

  if (filteredNodes.length === 0) {
    return null
  }

  return (
    <Form.SsoRoot nodes={filteredNodes}>
      {filteredNodes.map((node) => (
        <Node node={node} key={getNodeId(node)} />
      ))}
    </Form.SsoRoot>
  )
}

/**
 * The `OryFormSsoForm` component renders the Ory Form for SSO methods (OIDC and SAML).
 *
 * It is its own `<form>` element, so that a click on a provider button submits the
 * SSO method and not whichever method the main form is on. It shares the form state
 * of the surrounding card though: on a one-step registration screen the traits render
 * next to the provider buttons, and a value the user entered there (a consent checkbox,
 * for example) has to survive the click. Fields belonging to another method are dropped
 * from the payload at submission time instead.
 *
 * @returns a React component that renders the Ory Form for SSO methods.
 * @group Components
 */
export function OryFormSsoForm() {
  const {
    flow: { ui },
  } = useOryFlow()
  const parentForm = useFormContext()

  // Only get the oidc nodes.
  const filteredNodes = ui.nodes.filter(
    (node) =>
      node.group === UiNodeGroupEnum.Saml ||
      node.group === UiNodeGroupEnum.Oidc,
  )

  if (filteredNodes.length === 0) {
    return null
  }

  const form = (
    <OryForm data-testid={`ory/form/methods/oidc-saml`}>
      <OryFormSsoButtons />
    </OryForm>
  )

  // The component is exported, so it may be rendered outside of a card. Only then
  // does it need to bring a form state of its own.
  if (parentForm) {
    return form
  }

  return <OryFormProvider nodes={filteredNodes}>{form}</OryFormProvider>
}
