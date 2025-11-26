import { removeEmptyStrings } from "./removeFalsyValues"

describe("removeFalsyValues", () => {
  test("removes falsy values from objects", () => {
    const input = {
      a: 1,
      b: null,
      c: undefined,
      d: "",
      e: false,
      f: {
        g: 0,
        h: "hello",
        i: null,
        j: {
          k: "",
          l: "world",
        },
      },
      m: [0, 1, "", null, { n: null, o: "test" }],
    }

    const expected = {
      a: 1,
      e: false,
      f: {
        g: 0,
        h: "hello",
        j: {
          l: "world",
        },
      },
      m: [0, 1, { o: "test" }],
    }

    expect(removeEmptyStrings(input)).toEqual(expected)
  })

  test("handles arrays correctly", () => {
    const input = [0, 1, "", null, { a: null, b: "value" }, [false, "", 2]]
    const expected = [0, 1, { b: "value" }, [false, 2]]
    expect(removeEmptyStrings(input)).toEqual(expected)
  })

  test("returns non-object values as-is", () => {
    expect(removeEmptyStrings(0)).toBe(0)
    expect(removeEmptyStrings("")).toBe("")
    expect(removeEmptyStrings(null)).toBeNull()
    expect(removeEmptyStrings(undefined)).toBeUndefined()
    expect(removeEmptyStrings(false)).toBe(false)
  })

  test("handles nested structures", () => {
    const input = {
      a: {
        b: {
          c: null,
          d: "value",
          e: {
            f: "",
            g: 42,
          },
        },
      },
      h: [null, "", { i: false, j: "text" }],
    }

    const expected = {
      a: {
        b: {
          d: "value",
          e: {
            g: 42,
          },
        },
      },
      h: [{ i: false, j: "text" }],
    }

    expect(removeEmptyStrings(input)).toEqual(expected)
  })
})
