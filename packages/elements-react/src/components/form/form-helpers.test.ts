// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { unrollTrait } from "./form-helpers"

describe("unrollTrait", () => {
  type UnrollTrait<
    T extends string,
    V,
  > = T extends `${infer Head}.${infer Tail}`
    ? { [K in Head]: UnrollTrait<Tail, V> }
    : { [K in T]: V }

  test("should create a nested structure for a single input", () => {
    const input = { name: "a.b.c", value: 42 }
    const expected = { a: { b: { c: 42 } } }
    const result = unrollTrait(input)
    expect(result).toEqual(expected)
  })

  test("should merge with an existing structure", () => {
    const input: { name: string; value: number | string | object } = {
      name: "a.b.c",
      value: 42,
    }
    const output = { a: { b: { d: "existing" } } }
    const expected = { a: { b: { c: 42, d: "existing" } } }
    const result = unrollTrait(input, output)
    expect(result).toEqual(expected)
  })

  test("should handle single-level keys", () => {
    const input = { name: "key", value: "value" }
    const expected = { key: "value" }
    const result = unrollTrait(input)
    expect(result).toEqual(expected)
  })

  test("should handle empty output object", () => {
    const input = { name: "x.y.z", value: "value" }
    const expected = { x: { y: { z: "value" } } }
    const result = unrollTrait(input, {})
    expect(result).toEqual(expected)
  })

  test("should return undefined if the name is empty", () => {
    const input = { name: "", value: "value" }
    const result = unrollTrait(input)
    expect(result).toStrictEqual({})
  })

  test("should handle input with overlapping keys", () => {
    const input1 = { name: "a.b.c", value: 1 }
    const input2 = { name: "a.b.d", value: 2 }
    const output: Partial<UnrollTrait<string, unknown>> = {}
    unrollTrait(input1, output)
    unrollTrait(input2, output)

    const expected = { a: { b: { c: 1, d: 2 } } }
    expect(output).toEqual(expected)
  })

  test("should not modify the output object for disjoint keys", () => {
    const input1 = { name: "p.q", value: 100 }
    const input2 = { name: "x.y.z", value: 200 }
    const output: Partial<UnrollTrait<string, unknown>> = {}
    unrollTrait(input1, output)
    unrollTrait(input2, output)

    const expected = { p: { q: 100 }, x: { y: { z: 200 } } }
    expect(output).toEqual(expected)
  })
})
