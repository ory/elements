// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { resolveTransientPayload } from "./transientPayload"
import type { FormValues } from "../types"

test("should return empty object when transientPayload is undefined", () => {
  const result = resolveTransientPayload(undefined, {})
  expect(result).toEqual({})
})

test("should return static object as-is", () => {
  const payload = { locale: "en-US", referral_code: "ABC123" }
  const result = resolveTransientPayload(payload, {})
  expect(result).toEqual({ locale: "en-US", referral_code: "ABC123" })
})

test("should call function with form values and return result", () => {
  const formValues: FormValues = {
    "traits.email": "test@example.com",
    method: "password",
  }
  const factory = (values: FormValues) => ({
    email_domain: String(values["traits.email"]).split("@")[1],
  })
  const result = resolveTransientPayload(factory, formValues)
  expect(result).toEqual({ email_domain: "example.com" })
})

test("should merge resolved payload over existing node values", () => {
  const existingNodeValues = {
    captcha_turnstile_response: "token-abc",
    locale: "de-DE",
  }
  const userPayload = { locale: "en-US", referral_code: "ABC123" }
  const result = resolveTransientPayload(userPayload, {}, existingNodeValues)
  expect(result).toEqual({
    captcha_turnstile_response: "token-abc",
    locale: "en-US",
    referral_code: "ABC123",
  })
})

test("should normalize non-object factory return to empty object", () => {
  const factory = () => null as unknown as Record<string, unknown>
  const result = resolveTransientPayload(factory, {})
  expect(result).toEqual({})
})

test("should normalize array factory return to empty object", () => {
  const factory = () => [1, 2, 3] as unknown as Record<string, unknown>
  const result = resolveTransientPayload(factory, {})
  expect(result).toEqual({})
})

test("should preserve node values when user payload has no overlap", () => {
  const existingNodeValues = { captcha_turnstile_response: "token-abc" }
  const userPayload = { referral_code: "ABC123" }
  const result = resolveTransientPayload(userPayload, {}, existingNodeValues)
  expect(result).toEqual({
    captcha_turnstile_response: "token-abc",
    referral_code: "ABC123",
  })
})
