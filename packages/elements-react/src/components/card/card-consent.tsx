// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useComponents, useOryFlow } from "../../context"
import { OryForm } from "../form"
import { Node } from "../form/nodes/node"
import { OryCard } from "./card"
import { OryCardContent } from "./content"
import { OryCardFooter } from "./footer"
import { OryCardHeader } from "./header"
import {
  getNodeId,
  UiNode,
  isUiNodeInputAttributes,
  UiNodeInputAttributesTypeEnum,
} from "@ory/client-fetch"

/**
 * Returns a unique key for a consent node.
 * For input nodes, combines name with value for uniqueness.
 *
 * @internal Exported for testing
 */
export function getConsentNodeKey(node: UiNode): string {
  if (isUiNodeInputAttributes(node.attributes)) {
    const { name, value } = node.attributes
    if (value !== undefined && value !== null) {
      return `${name}_${String(value)}`
    }
    return name
  }
  return getNodeId(node)
}

/**
 * Checks if a node should be rendered in the footer instead of the main content.
 * The Remember checkbox and submit buttons are rendered by ConsentCardFooter.
 *
 * @internal Exported for testing
 */
export function isFooterNode(node: UiNode): boolean {
  if (!isUiNodeInputAttributes(node.attributes)) {
    return false
  }
  const { name, type } = node.attributes
  return name === "remember" || type === UiNodeInputAttributesTypeEnum.Submit
}

/**
 * The `OryConsentCard` component renders a card for displaying the OAuth2 consent flow.
 *
 * @returns The consent card component.
 * @group Components
 */
export function OryConsentCard() {
  const { Form, Card } = useComponents()
  const flow = useOryFlow()
  return (
    <OryCard>
      <OryCardHeader />
      <OryCardContent>
        <OryForm>
          <Card.Divider />
          <Form.Group>
            {flow.flow.ui.nodes
              .filter((node) => !isFooterNode(node))
              .map((node) => (
                <Node key={getConsentNodeKey(node)} node={node} />
              ))}
          </Form.Group>
          <Card.Divider />
          <OryCardFooter />
        </OryForm>
      </OryCardContent>
    </OryCard>
  )
}
