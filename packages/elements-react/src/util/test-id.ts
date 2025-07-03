// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

/**
 * Helper function to generate a test id for a UiText message.
 *
 * @param message - the UiText message to generate a test id for
 * @returns a unique, stable test id for the message
 * @group Utilities
 */
export function messageTestId(message: { id: number | string }): {
  "data-testid": string
} {
  return {
    "data-testid": `ory/message/${message.id}`,
  }
}
