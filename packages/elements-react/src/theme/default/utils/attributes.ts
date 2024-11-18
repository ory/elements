// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export function omit<OBJ extends object>(
  obj: OBJ,
  keys: (keyof OBJ)[],
): Omit<typeof obj, (typeof keys)[number]> {
  const ret = { ...obj }
  for (const key of keys) {
    delete ret[key]
  }
  return ret
}
