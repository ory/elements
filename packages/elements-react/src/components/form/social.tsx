// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useComponents } from "../../context"
import { useOryFlow } from "../../context"
import { UiNode, UiNodeInputAttributes } from "@ory/client-fetch"
import { PropsWithChildren } from "react"
import { OryForm } from "./form"
import { useFormContext } from "react-hook-form"
import { OryFormProvider } from "./form-provider"

export type OryFormOidcRootProps = PropsWithChildren<{
  nodes: UiNode[]
}>

export type OryNodeOidcButtonProps = {
  node: UiNode
  attributes: UiNodeInputAttributes
  onClick?: () => void
}

export function OryFormOidcButtons() {
  const {
    flow: { ui },
  } = useOryFlow()
  const { setValue } = useFormContext()

  // Only get the oidc nodes.
  const filteredNodes = ui.nodes.filter((node) => node.group === "oidc")

  const { Form, Node } = useComponents()

  if (filteredNodes.length === 0) {
    return null
  }

  return (
    <Form.OidcRoot nodes={filteredNodes}>
      {filteredNodes.map((node, k) => (
        <Node.OidcButton
          node={node}
          key={k}
          attributes={node.attributes as UiNodeInputAttributes}
          onClick={() => {
            setValue(
              "provider",
              (node.attributes as UiNodeInputAttributes).value,
            )
            setValue("method", "oidc")
          }}
        />
      ))}
    </Form.OidcRoot>
  )
}

export function OryFormSocialButtonsForm() {
  const {
    flow: { ui },
  } = useOryFlow()

  // Only get the oidc nodes.
  const filteredNodes = ui.nodes.filter((node) => node.group === "oidc")

  if (filteredNodes.length === 0) {
    return null
  }

  return (
    <OryFormProvider>
      <OryForm>
        <OryFormOidcButtons />
      </OryForm>
    </OryFormProvider>
  )
}
