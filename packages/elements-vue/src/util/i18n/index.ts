// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiText } from "@ory/client-fetch"
import { useI18n } from "vue-i18n"
import { isDynamicText } from "../nodes"

type I18nComposer = ReturnType<typeof useI18n>

/**
 * Converts a UiText to a formatted message using vue-i18n.
 * The UiText contains the id of the message and the context.
 * The context is used to inject values into the message from Ory, e.g. a timestamp.
 *
 * @param uiText - The UiText is part of the UiNode object sent by Kratos when performing a flow.
 * @param i18n - The i18n object from vue-i18n
 */
export const uiTextToFormattedMessage = (
  { id, context = {}, text }: Omit<UiText, "type">,
  i18n: I18nComposer,
) => {
  const contextInjectedMessage = Object.entries(context).reduce(
    (accumulator, [key, value]) => {
      // context might provide an array of objects instead of a single object
      // for example when looking up a recovery code
      if (Array.isArray(value)) {
        return {
          ...accumulator,
          [key]: value,
          [key + "_list"]: value.join(", "),
        }
      } else if (key.endsWith("_unix")) {
        if (typeof value === "number") {
          const date = new Date(value * 1000)
          return {
            ...accumulator,
            [key]: String(i18n.d(date)),
            [key + "_since_minutes"]: Math.ceil(
              (value - new Date().getTime() / 1000) / 60,
            ).toFixed(0),
            [key + "_until_minutes"]: Math.ceil(
              (new Date().getTime() / 1000 - value) / 60,
            ).toFixed(0),
          }
        }
      } else if (key === "property") {
        return {
          ...accumulator,
          [key]: String(i18n.t(`property.${value}`, String(value))),
        }
      }
      return {
        ...accumulator,
        [key]: value as string | number,
      }
    },
    {},
  )

  return String(
    i18n.t(`identities.messages.${id}`, contextInjectedMessage, text),
  )
}

/**
 * Resolves a placeholder for an input field.
 *
 * @param text - The UiText containing label information
 * @param i18n - The i18n object from vue-i18n
 */
export function resolvePlaceholder(text: UiText, i18n: I18nComposer): string {
  const fallback = String(
    i18n.t(
      "input.placeholder",
      { placeholder: uiTextToFormattedMessage(text, i18n) },
      `Enter your ${uiTextToFormattedMessage(text, i18n)}`,
    ),
  )

  if (isDynamicText(text)) {
    const field = text.context.name
    return String(i18n.t(`forms.input.placeholder.${field}`, fallback))
  }
  return fallback
}
