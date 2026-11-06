// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiText } from "@ory/client-fetch"
import { IntlShape } from "react-intl"
import { OryErrorEvent } from "./events"
import { OryFlowContainer } from "./flowContainer"
import { uiTextToFormattedMessage } from "./i18n"

/**
 * Message id used for the client-side rate limit message. Deliberately
 * outside the Kratos message id ranges (1xxxxxx-5xxxxxx) so it can never
 * collide with a server-side message.
 */
export const rateLimitedMessageId = 9000001

/**
 * Returns the message for a rate-limited submission: the Kratos login throttle
 * message when brute-force protection refused a login, and the generic rate
 * limit message otherwise.
 */
export function rateLimitedMessage(
  event: Extract<OryErrorEvent, { type: "rate_limited" }>,
  intl: IntlShape,
): UiText {
  if (event.body?.error.id === "login_throttled") {
    const details: unknown = event.body.error.details
    const retryAfter =
      typeof details === "object" &&
      details !== null &&
      "retry_after" in details &&
      typeof details.retry_after === "number"
        ? details.retry_after
        : event.retryAfter
    if (retryAfter !== undefined) {
      // The block end is taken from this browser's clock, so a clock that is
      // off does not change the remaining wait shown to the user.
      const context = {
        retry_after: retryAfter,
        retry_at_unix: Math.floor(Date.now() / 1000) + retryAfter,
      }
      return {
        id: 4010012,
        type: "error",
        text: uiTextToFormattedMessage(
          { id: 4010012, context, text: "" },
          intl,
        ),
        context,
      }
    }
  }
  return {
    id: rateLimitedMessageId,
    type: "error",
    text: intl.formatMessage({
      id: "messages.rate-limited",
      defaultMessage: "Too many requests. Please wait a moment and try again.",
    }),
  }
}

/**
 * Returns a copy of the flow container with the message appended to
 * `flow.ui.messages`. An existing message with the same id is replaced, so
 * repeated events do not stack duplicates.
 */
export function appendUiMessage<T extends OryFlowContainer>(
  container: T,
  message: UiText,
): T {
  return {
    ...container,
    flow: {
      ...container.flow,
      ui: {
        ...container.flow.ui,
        messages: [
          ...(container.flow.ui.messages ?? []).filter(
            (m) => m.id !== message.id,
          ),
          message,
        ],
      },
    },
  }
}
