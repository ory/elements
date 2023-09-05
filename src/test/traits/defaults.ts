// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { Traits } from "../types"
import { RandomEmail, RandomPassword } from "../utils"

export const email = RandomEmail()
export const password = RandomPassword()

export const defaultTraits: Record<string, Traits> = {
  "traits.email": {
    group: "default",
    node_type: "input",
    required: true,
    label: "Email",
    type: "email",
    value: email,
  },
  password: {
    group: "password",
    node_type: "input",
    required: true,
    label: "Password",
    type: "password",
    value: password,
  },
}
