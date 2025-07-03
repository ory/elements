// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useComponents } from "../../context"
import { useOryFlow } from "../../context"
import {
  getNodeId,
  UiNode,
  UiNodeGroupEnum,
  UiNodeInputAttributes,
} from "@ory/client-fetch"
import { PropsWithChildren } from "react"
import { OryForm } from "./form"
import { useFormContext } from "react-hook-form"
import { OryFormProvider } from "./form-provider"

export type OryFormSsoRootProps = PropsWithChildren<{
  nodes: UiNode[]
}>

/**
 * Props for the OryNodeSsoButton component.
 */
export type OryNodeSsoButtonProps = {
  node: UiNode
  attributes: UiNodeInputAttributes
  onClick?: () => void
}

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
  const { setValue } = useFormContext()

  // Only get the oidc nodes.
  const filteredNodes = ui.nodes.filter(
    (node) =>
      node.group === UiNodeGroupEnum.Oidc ||
      node.group === UiNodeGroupEnum.Saml,
  )

  const { Form, Node } = useComponents()

  if (filteredNodes.length === 0) {
    return null
  }

  return (
    <Form.SsoRoot nodes={filteredNodes}>
      {filteredNodes.map((node) => (
        <Node.SsoButton
          node={node}
          key={getNodeId(node)}
          attributes={node.attributes as UiNodeInputAttributes}
          onClick={() => {
            setValue(
              "provider",
              (node.attributes as UiNodeInputAttributes).value,
            )
            setValue("method", node.group)
          }}
        />
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
