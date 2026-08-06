// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiText } from "@ory/client-fetch"
import { OryFlowContainer } from "./flowContainer"

/**
 * Message id used for the client-side rate limit message. Deliberately
 * outside the Kratos message id ranges (1xxxxxx-5xxxxxx) so it can never
 * collide with a server-side message.
 */
export const rateLimitedMessageId = 9000001

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
