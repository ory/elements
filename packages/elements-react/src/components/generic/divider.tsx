// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useComponents } from "../../context"
import { useOryFlow } from "../../context"

/**
 * Props type for the Form Group Divider component.
 */
export type OryCardDividerProps = Record<string, never>

/**
 * Renders the @see Card.Divider between the groups of nodes in the Ory Form.
 *
 * You can use this component to build fully custom implementations of the Ory Flows.
 *
 * However, you most likely want to override the individual components instead.
 *
 * @returns
 */
export function OryFormGroupDivider() {
  const { Card } = useComponents()
  const {
    flow: { ui },
  } = useOryFlow()

  // Only get the oidc nodes.
  const filteredNodes = ui.nodes.filter((node) => node.group === "oidc")

  // Are there other first-factor nodes available?
  const otherNodes = ui.nodes.filter(
    (node) => node.group !== "oidc" && node.group !== "default",
  )

  if (filteredNodes.length > 0 && otherNodes.length > 0) {
    return <Card.Divider />
  }
  return null
}
