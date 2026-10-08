// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

const storageKey = "ory_elements_last_identifier"

type IdentifierStorage = Pick<Storage, "getItem" | "setItem">

function identifierStorage(): IdentifierStorage | undefined {
  if (typeof window === "undefined") {
    return undefined
  }
  try {
    // Reading the property throws when the browser blocks site data.
    return window.sessionStorage
  } catch {
    return undefined
  }
}

/**
 * Remembers the identifier the user last typed, so that later screens can
 * offer it again. Does nothing when no storage is available.
 *
 * @param identifier - The identifier as the user entered it.
 */
export function rememberLastIdentifier(identifier: string): void {
  const value = identifier.trim()
  if (!value) {
    return
  }
  try {
    identifierStorage()?.setItem(storageKey, value)
  } catch {
    return
  }
}

/**
 * Returns the identifier the user last typed, without forgetting it.
 *
 * @returns The identifier, or `undefined` when none is remembered or no
 * storage is available.
 */
export function readLastIdentifier(): string | undefined {
  try {
    return identifierStorage()?.getItem(storageKey) ?? undefined
  } catch {
    return undefined
  }
}
