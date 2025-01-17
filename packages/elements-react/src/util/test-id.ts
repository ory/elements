// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiText } from "@ory/client-fetch"

/**
 * Helper function to generate a test id for a UiText message.
 *
 * @param message - the UiText message to generate a test id for
 * @returns a unique, stable test id for the message
 */
export function messageTestId(message: UiText) {
  return {
    "data-testid": `ory/message/${message.id}`,
  }
}
