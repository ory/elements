// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Traits } from "../types"
import { defaultTraits, email } from "./defaults"

export const defaultVerificationEmailTraits: Record<string, Traits> = {
  email: {
    group: "code",
    label: "Email",
    type: "email",
    value: email,
    node_type: "input",
    required: true,
  },
  submitButton: {
    group: "code",
    node_type: "input",
    label: "Submit",
    type: "submit",
    value: "code",
    name: "method",
  },
}

export const defaultVerificationTraits: Record<string, Traits> = {
  "traits.email": defaultTraits["traits.email"],
}
