// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { readLastIdentifier, rememberLastIdentifier } from "./lastIdentifier"

beforeEach(() => {
  window.sessionStorage.clear()
})

afterEach(() => {
  jest.restoreAllMocks()
})

test("should return undefined when no identifier was remembered", () => {
  expect(readLastIdentifier()).toBeUndefined()
})

test("should return the remembered identifier", () => {
  rememberLastIdentifier("jane@example.com")

  expect(readLastIdentifier()).toBe("jane@example.com")
})

test("should keep the identifier after it was read", () => {
  rememberLastIdentifier("jane@example.com")
  readLastIdentifier()

  expect(readLastIdentifier()).toBe("jane@example.com")
})

test("should overwrite the previously remembered identifier", () => {
  rememberLastIdentifier("jane@example.com")
  rememberLastIdentifier("john@example.com")

  expect(readLastIdentifier()).toBe("john@example.com")
})

test("should remember the identifier without surrounding whitespace", () => {
  rememberLastIdentifier("  jane@example.com ")

  expect(readLastIdentifier()).toBe("jane@example.com")
})

test("should keep the previous identifier when asked to remember a blank one", () => {
  rememberLastIdentifier("jane@example.com")
  rememberLastIdentifier("   ")

  expect(readLastIdentifier()).toBe("jane@example.com")
})

test("should not use storage that outlives the tab", () => {
  rememberLastIdentifier("jane@example.com")

  expect(window.localStorage).toHaveLength(0)
  expect(document.cookie).toBe("")
})

test("should skip silently when writing to storage throws", () => {
  jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("QuotaExceededError")
  })

  expect(() => rememberLastIdentifier("jane@example.com")).not.toThrow()
  expect(readLastIdentifier()).toBeUndefined()
})

test("should return undefined when reading from storage throws", () => {
  rememberLastIdentifier("jane@example.com")
  jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("SecurityError")
  })

  expect(readLastIdentifier()).toBeUndefined()
})

test("should skip silently when accessing the storage itself throws", () => {
  jest.spyOn(window, "sessionStorage", "get").mockImplementation(() => {
    throw new Error("SecurityError")
  })

  expect(() => rememberLastIdentifier("jane@example.com")).not.toThrow()
  expect(readLastIdentifier()).toBeUndefined()
})
