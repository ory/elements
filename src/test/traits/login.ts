// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { Traits } from "../types"
import { email, password } from "./defaults"

export const defaultLoginTraits: Record<string, Traits> = {
  identifier: {
    group: "default",
    label: "Email",
    type: "input",
    value: email,
    node_type: "input",
    required: true,
  },
  password: {
    group: "password",
    node_type: "input",
    required: true,
    label: "Password",
    type: "input",
    value: password,
  },
  submitButton: {
    group: "password",
    node_type: "input",
    label: "Sign in",
    type: "submit",
    value: "password",
    name: "method",
  },
}
