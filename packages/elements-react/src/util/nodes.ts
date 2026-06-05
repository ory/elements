// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { UiNode, UiNodeInputAttributes, UiText } from "@ory/client-fetch"
import { uiTextToFormattedMessage } from "./i18n"
import { useIntl } from "react-intl"

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

export function resolveLabel(text: UiText, intl: ReturnType<typeof useIntl>) {
  if (isDynamicText(text)) {
    const field = text.context.name
    const id = `forms.label.${field}`
    const msg = {
      id,
      defaultMessage: text.text,
    }
    return intl.formatMessage(msg)
  }
  return uiTextToFormattedMessage(text, intl)
}

/**
 * Resolves the display text for a schema-driven enum option.
 *
 * Options come from Kratos carrying only the raw enum value. We give
 * consumers a deterministic localization hook by looking up
 * `forms.option.{name}.{value}` in the intl catalogue and fall back to the
 * raw value when no translation is registered. This mirrors `resolveLabel`'s
 * `forms.label.{name}` convention so apps can ship one set of custom
 * translations for every form field.
 */
export function resolveOptionLabel(
  name: string,
  value: unknown,
  intl: ReturnType<typeof useIntl>,
) {
  const stringValue = String(value)
  // The descriptor is assigned to a variable so the FormatJS TS transformer
  // does not try to statically extract the dynamic `id` — this mirrors the
  // pattern used by `resolveLabel` above.
  const msg = {
    id: `forms.option.${name}.${stringValue}`,
    defaultMessage: stringValue,
  }
  return intl.formatMessage(msg)
}
