// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode, UiNodeInputAttributes, UiText } from "@ory/client-fetch"
import { useI18n } from "vue-i18n"
import { uiTextToFormattedMessage } from "./i18n"

/**
 * Finds a screen selection button from a list of nodes.
 *
 * @param nodes - The nodes to search
 */
export function findScreenSelectionButton(
  nodes: UiNode[],
): { attributes: UiNodeInputAttributes } | undefined {
  return nodes.find(
    (node) =>
      node.attributes.node_type === "input" &&
      node.attributes.type === "submit" &&
      node.attributes.name === "screen",
  ) as { attributes: UiNodeInputAttributes }
}

/**
 * Checks if a UiText is a dynamic text with a name context.
 *
 * @param text - The UiText to check
 */
export function isDynamicText(
  text: UiText,
): text is UiText & { context: { name: string } } {
  return (
    text.id === 1070002 &&
    !!text.context &&
    "name" in text.context &&
    typeof text.context["name"] === "string"
  )
}

/**
 * Resolves a label from a UiText, handling dynamic text.
 *
 * @param text - The UiText containing the label
 * @param i18n - The i18n object from vue-i18n
 */
export function resolveLabel(
  text: UiText,
  i18n: ReturnType<typeof useI18n>,
): string {
  if (isDynamicText(text)) {
    const field = text.context.name
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return String(i18n.t(`forms.label.${field}`, text.text))
  }
  return uiTextToFormattedMessage(text, i18n)
}
