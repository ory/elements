// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  isUiNodeInputAttributes,
  isUiNodeScriptAttributes,
  UiNode,
  UiNodeGroupEnum,
} from "@ory/client-fetch"

type GroupedNodes = Partial<Record<UiNodeGroupEnum, UiNode[]>>

type NodeGroupsOptions = {
  omit?: Array<"script" | "input_hidden">
}

/**
 * Groups nodes by their group and returns an object with the groups and entries.
 *
 * @param nodes - The nodes to group
 * @param opts - The options to use
 */
export function getNodeGroups(
  nodes: UiNode[],
  { omit }: NodeGroupsOptions = {},
): {
  groups: GroupedNodes
  entries: [UiNodeGroupEnum, UiNode[]][]
} {
  const groups: Partial<Record<UiNodeGroupEnum, UiNode[]>> = {}
  const groupRetained: Partial<Record<UiNodeGroupEnum, number>> = {}

  for (const node of nodes) {
    const groupNodes = groups[node.group] ?? []
    groupNodes.push(node)
    groups[node.group] = groupNodes

    if (omit?.includes("script") && isUiNodeScriptAttributes(node.attributes)) {
      continue
    }

    if (
      omit?.includes("input_hidden") &&
      isUiNodeInputAttributes(node.attributes) &&
      node.attributes.type === "hidden"
    ) {
      continue
    }

    groupRetained[node.group] = (groupRetained[node.group] ?? 0) + 1
  }

  const finalGroups: Partial<Record<UiNodeGroupEnum, UiNode[]>> = {}
  for (const [group, count] of Object.entries(groupRetained)) {
    if (count > 0) {
      finalGroups[group as UiNodeGroupEnum] = groups[group as UiNodeGroupEnum]
    }
  }

  const entries = Object.entries(finalGroups) as [UiNodeGroupEnum, UiNode[]][]

  return {
    groups: finalGroups,
    entries,
  }
}

/**
 * Filters nodes to only include script nodes with webauthn_script id.
 */
export function getScriptNodes(nodes: UiNode[]): UiNode[] {
  return nodes.filter(
    (node) =>
      isUiNodeScriptAttributes(node.attributes) &&
      node.attributes.id === "webauthn_script",
  )
}
