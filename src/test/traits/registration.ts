// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { Traits } from "../types"
import { email, password } from "./defaults"

export const defaultRegistrationTraits: Record<string, Traits> = {
  "traits.email": {
    group: "password",
    node_type: "input",
    required: true,
    label: "Email",
    type: "input",
    value: email,
  },
  password: {
    group: "password",
    node_type: "input",
    required: true,
    label: "Password",
    type: "input",
    value: password,
  },
  tos: {
    group: "default",
    node_type: "input",
    required: true,
    label: "I agree to the terms of service",
    type: "checkbox",
    value: "",
  },
  submitButton: {
    group: "default",
    node_type: "input",
    label: "Sign up",
    type: "submit",
    value: "password",
    name: "method",
  },
}
