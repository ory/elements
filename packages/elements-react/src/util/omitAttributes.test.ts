// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { omitInputAttributes } from "./omitAttributes"

test("should drop input-only attributes that are invalid on other elements", () => {
  const attrs = omitInputAttributes({
    name: "email",
    value: "user@example.com",
    autocomplete: "email",
    inputmode: undefined,
    maxlength: 6,
  })

  expect(attrs).toEqual({ name: "email", value: "user@example.com" })
  expect(attrs).not.toHaveProperty("inputmode")
})
