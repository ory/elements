// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useComponents } from "../../context"
import { useOryFlow } from "../../context"

export type HorizontalDividerProps = Record<string, never>

export function OryFormGroupDivider() {
  const { HorizontalDivider } = useComponents()
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
    return <HorizontalDivider />
  }
  return null
}
