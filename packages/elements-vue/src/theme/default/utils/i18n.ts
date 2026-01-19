// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import type { UiText } from "@ory/client-fetch"

/**
 * Check if the text is a dynamic text (id 1070002 with a name context)
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
 * Converts a UiText to a translated message string.
 */
export function uiTextToFormattedMessage(
  { id, context = {}, text }: Omit<UiText, "type">,
  t: (key: string, values?: Record<string, unknown>) => string,
): string {
  // Build the context with any necessary transformations
  const contextInjectedMessage = Object.entries(context).reduce(
    (accumulator, [key, value]) => {
      if (Array.isArray(value)) {
        return {
          ...accumulator,
          [key]: value,
          [key + "_list"]: value.join(", "),
        }
      } else if (key.endsWith("_unix")) {
        if (typeof value === "number") {
          return {
            ...accumulator,
            [key]: new Date(value * 1000).toLocaleDateString(),
            [key + "_since_minutes"]: Math.ceil(
              (value - new Date().getTime() / 1000) / 60,
            ).toFixed(0),
            [key + "_until_minutes"]: Math.ceil(
              (new Date().getTime() / 1000 - value) / 60,
            ).toFixed(0),
          }
        }
      } else if (key === "property") {
        const translationKey = `property.${value}`
        const translated = t(translationKey)
        return {
          ...accumulator,
          [key]: translated === translationKey ? (value as string) : translated,
        }
      }
      return {
        ...accumulator,
        [key]: value as string | number,
      }
    },
    {} as Record<string, unknown>,
  )

  // Look up translation by message ID
  const translated = t(`identities.messages.${id}`, contextInjectedMessage)

  // If translation key not found, return default text
  if (translated === `identities.messages.${id}`) {
    return text
  }

  return translated
}

/**
 * Resolve a label to its translated text.
 */
export function resolveLabel(
  text: UiText,
  t: (key: string, values?: Record<string, unknown>) => string,
): string {
  if (isDynamicText(text)) {
    const field = text.context.name
    const translated = t(`forms.label.${field}`)
    // If not found, fall back to uiTextToFormattedMessage
    if (translated !== `forms.label.${field}`) {
      return translated
    }
  }
  return uiTextToFormattedMessage(text, t)
}

/**
 * Resolve a placeholder to its translated text.
 */
export function resolvePlaceholder(
  text: UiText,
  t: (key: string, values?: Record<string, unknown>) => string,
): string {
  const labelText = uiTextToFormattedMessage(text, t)
  const fallback =
    t("input.placeholder", { placeholder: labelText }) ||
    `Enter your ${labelText}`

  if (isDynamicText(text)) {
    const field = text.context.name
    const translated = t(`forms.input.placeholder.${field}`)
    if (translated !== `forms.input.placeholder.${field}`) {
      return translated
    }
  }

  return fallback === "input.placeholder" ? `Enter your ${labelText}` : fallback
}
