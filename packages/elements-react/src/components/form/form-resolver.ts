// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useOryFlow } from "../../context"
import { FormValues } from "../../types"
import { isUiNodeInputAttributes } from "@ory/client-fetch"

function isCodeResendRequest(data: FormValues) {
  // There are three types of resend
  return data.email ?? data.resend ?? data.recovery_confirm_address
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
      // This is a workaround which prevents the flow from being submitted without a code,
      // which in some cases can cause issues in Ory Kratos' resend detection.
      if (
        // When we submit a code
        data.method === "code" &&
        // And the code is not present
        !data.code &&
        // And the flow is not a code resend request
        !isCodeResendRequest(data) &&
        // And the flow has a code input node
        flowContainer.flow.ui.nodes.find(({ attributes, group }) => {
          if (!isUiNodeInputAttributes(attributes)) {
            return false
          }

          return (
            group === "code" &&
            attributes.name === "code" &&
            attributes.type !== "hidden"
          )
        })
      ) {
        return {
          values: data,
          errors: {
            // We know the code node exists, so we can safely hardcode the ID.
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
