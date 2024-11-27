// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useOryFlow } from "../../context"
import { FormValues } from "../../types"

function isCodeResendRequest(data: FormValues) {
  return data.email ?? data.resend
}

/**
 * Creates a resolver for the Ory form
 *
 * The resolver does form validation for missing fields in the form.
 *
 * @returns a react-hook-form resolver for the Ory form
 */
export function useOryFormResolver() {
  const flowContainer = useOryFlow()

  return (data: FormValues) => {
    if (flowContainer.formState.current === "method_active") {
      if (data.method === "code" && !data.code && !isCodeResendRequest(data)) {
        return {
          values: data,
          errors: {
            code: {
              id: 4000002,
              context: {
                property: "code",
              },
              type: "error",
              text: "Property code is missing",
            },
          },
        }
      }
    }
    return {
      values: data,
      errors: {},
    }
  }
}
