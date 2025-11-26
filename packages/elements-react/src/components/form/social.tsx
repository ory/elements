// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { getNodeId, UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import { PropsWithChildren } from "react"
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
 * It needs to be its own form, as the OIDC buttons are form submits but are not related to the main form.
 *
 * @returns a React component that renders the Ory Form for SSO methods.
 * @group Components
 */
export function OryFormSsoForm() {
  const {
    flow: { ui },
  } = useOryFlow()

  // Only get the oidc nodes.
  const filteredNodes = ui.nodes.filter(
    (node) =>
      node.group === UiNodeGroupEnum.Saml ||
      node.group === UiNodeGroupEnum.Oidc,
  )

  if (filteredNodes.length === 0) {
    return null
  }

  return (
    <OryFormProvider>
      <OryForm data-testid={`ory/form/methods/oidc-saml`}>
        <OryFormSsoButtons />
      </OryForm>
    </OryFormProvider>
  )
}
