// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { omit } from "../attributes"

test("deletes keys from object", () => {
  const obj = {
    a: 1,
    b: 2,
    c: 3,
  }
  const result = omit(obj, ["a", "c"])
  expect(result).toEqual({ b: 2 })
})

test("ignores unknown keys", () => {
  const obj = {
    a: 1,
    b: 2,
    c: 3,
  }
  const result = omit(obj, ["a", "x"] as (keyof typeof obj)[])
  expect(result).toEqual({ b: 2, c: 3 })
})

test("returns object if keys are empty", () => {
  const obj = {
    a: 1,
    b: 2,
    c: 3,
  }
  const result = omit(obj, [])
  expect(result).toEqual({ a: 1, b: 2, c: 3 })
})
