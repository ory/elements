// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode, UiNodeGroupEnum } from "@ory/client-fetch"

export function isChoosingMethod(uiNodes: UiNode[]): boolean {
  return (
    uiNodes.some(
      (node) =>
        "name" in node.attributes &&
        node.attributes.name === "screen" &&
        "value" in node.attributes &&
        node.attributes.value === "previous",
    ) ||
    uiNodes.some(
      (node) =>
        node.group === UiNodeGroupEnum.IdentifierFirst &&
        "name" in node.attributes &&
        node.attributes.name === "identifier" &&
        node.attributes.type === "hidden",
    )
  )
}

export function filterOidcOut(nodes: UiNode[]): UiNode[] {
  return nodes.filter((node) => node.group !== UiNodeGroupEnum.Oidc)
}

export function getFinalNodes(
  uniqueGroups: Partial<Record<UiNodeGroupEnum, UiNode[]>>,
  selectedGroup: UiNodeGroupEnum | undefined,
): UiNode[] {
  const selectedNodes: UiNode[] = selectedGroup
    ? (uniqueGroups[selectedGroup] ?? [])
    : []

  return [
    ...(uniqueGroups?.identifier_first ?? []),
    ...(uniqueGroups?.default ?? []),
    ...(uniqueGroups?.captcha ?? []),
  ]
    .flat()
    .filter(
      (node) => "type" in node.attributes && node.attributes.type === "hidden",
    )
    .concat(selectedNodes)
}
