// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiText } from "@ory/client-fetch"
import { IntlShape } from "react-intl"

/**
 * Converts a UiText to a FormattedMessage.
 * The UiText contains the id of the message and the context.
 * The context is used to inject values into the message from Ory, e.g. a timestamp.
 * For example a UI Node from Ory might look like this:
 *
 * ```json
 * {
 *  "type":"input",
 *  "group":"default",
 *  "attributes": {
 *      "name":"traits.email",
 *      "type":"email",
 *      "required":true,
 *      "autocomplete":"email",
 *      "disabled":false,
 *      "node_type":"input"
 *  },
 *  "messages":[],
 *  "meta": {
 *    "label": {
 *      "id":1070002,
 *      "text":"E-Mail",
 *      "type":"info",
 *      "context":{
 *        "title":"E-Mail"
 *      },
 *    }
 *  }
 * }
 * ```
 *
 * The context has the key "title" which matches the formatter template name "\{title\}"
 * An example translation file would look like this:
 * ```json
 * {
 *  "identities.messages.1070002": "{title}"
 * }
 * ```
 *
 * The formatter would then take the meta.label.id and look for the translation with the key matching the id.
 * It would then replace the template "\{title\}" with the value from the context with the key "title".
 *
 * @param uiText - The UiText is part of the UiNode object sent by Kratos when performing a flow.
 * @param intl - The intl object from react-intl
 * @group Utilities
 */
export const uiTextToFormattedMessage = (
  { id, context = {}, text }: Omit<UiText, "type">,
  intl: IntlShape,
) => {
  const contextInjectedMessage = Object.entries(context).reduce(
    (accumulator, [key, value]) => {
      // context might provide an array of objects instead of a single object
      // for example when looking up a recovery code
      if (Array.isArray(value)) {
        return {
          ...accumulator,
          [key]: value,
          [key + "_list"]: intl.formatList<string>(value),
        }
      } else if (key.endsWith("_unix")) {
        if (typeof value === "number") {
          return {
            ...accumulator,
            [key]: intl.formatDate(new Date(value * 1000)),
            [key + "_since"]: intl.formatDateTimeRange(
              new Date(value),
              new Date(),
            ),
            [key + "_since_minutes"]: Math.ceil(
              (value - new Date().getTime() / 1000) / 60,
            ).toFixed(0),
            [key + "_until"]: intl.formatDateTimeRange(
              new Date(),
              new Date(value),
            ),
            [key + "_until_minutes"]: Math.ceil(
              (new Date().getTime() / 1000 - value) / 60,
            ).toFixed(0),
          }
        }
      } else if (key === "property") {
        return {
          ...accumulator,
          [key]: intl.formatMessage({
            id: `property.${value}`,
            defaultMessage: value,
          }),
        }
      }
      return {
        ...accumulator,
        [key]: value as string | number,
      }
    },
    {},
  )

  return intl.formatMessage(
    {
      id: `identities.messages.${id}`,
      defaultMessage: text,
    },
    contextInjectedMessage,
  )
}
