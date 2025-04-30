// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FetchError, RequiredError, ResponseError } from "@ory/client-fetch"
import { OnRedirectHandler } from "./continueWith"
import {
  isAddressNotVerified,
  isBrowserLocationChangeRequired,
  isCsrfError,
  isNeedsPrivilegedSessionError,
  isResponseError,
  isSelfServiceFlowExpiredError,
} from "./error"
import { verificationUrl } from "./urlHelpers"

export type ValidationErrorHandler<T> = (body: T) => void

type FlowErrorHandlerProps<T> = {
  /**
   * When the SDK returns an error indicating that the flow needs to be restarted, this function is called.
   *
   * @param useFlowId - If provided, the SDK should use this flow ID to not lose context of the flow.
   */
  onRestartFlow: (useFlowId?: string) => void

  /**
   * When the SDK returns a validation error, this function is called. The result should be used to update the
   * flow container.
   *
   * The function should return a FlowContainer or nothing.
   *
   * @param body - The body of the response.
   */
  onValidationError: ValidationErrorHandler<T>

  /**
   * This method is used to redirect the user to a different page.
   */
  onRedirect: OnRedirectHandler

  /**
   * The configuration object.
   */
  config: { sdk: { url: string } }
}

/**
 * Use this as the catch handler for all flow-related SDK calls, such as creating a login or submitting a login.
 *
 *
 * @param opts - The configuration object.
 */
export const handleFlowError =
  <T>(opts: FlowErrorHandlerProps<T>) =>
  async (err: unknown): Promise<void | T> => {
    if (isResponseError(err)) {
      const contentType = err.response.headers.get("content-type") || ""
      let body: unknown
      if (contentType.includes("application/json")) {
        // Handle JSON content
        body = await toBody(err.response)

        if (isSelfServiceFlowExpiredError(body)) {
          opts.onRestartFlow(body.use_flow_id)
          return
        } else if (isAddressNotVerified(body)) {
          opts.onRedirect(verificationUrl(opts.config), true)
          return
        } else if (
          isBrowserLocationChangeRequired(body) &&
          body.redirect_browser_to
        ) {
          opts.onRedirect(body.redirect_browser_to, true)
          return
        } else if (isNeedsPrivilegedSessionError(body)) {
          opts.onRedirect(body.redirect_browser_to, true)
          return
        } else if (isCsrfError(body)) {
          opts.onRestartFlow()
          return
        }
      } else if (
        contentType.includes("text/") ||
        contentType.includes("html") ||
        contentType.includes("xml")
      ) {
        // Handle human-readable content
        await logResponseError(err.response, true)
        throw new ResponseError(
          err.response,
          `The Ory API endpoint returned an unexpected HTML or text response. Check your console output for details.`,
        )
      } else {
        await logResponseError(err.response, false)
        // Handle binary/unknown content
        throw new ResponseError(
          err.response,
          "The Ory API endpoint returned unexpected content type `" +
            contentType +
            "`.  Check your console output for details.",
        )
      }

      switch (err.response.status) {
        case 404: // Does not exist
          opts.onRestartFlow()
          return
        case 410: // Expired
          // Re-initialize the flow
          opts.onRestartFlow()
          return
        case 400:
          return opts.onValidationError(
            // TODO: maybe we can do actual type checking here?
            (await err.response.json()) as unknown as T,
          )
        case 403: // This typically happens with CSRF violations.
          opts.onRestartFlow()
          return
        case 422: {
          throw new ResponseError(
            err.response,
            "The API returned an error code indicating a required redirect, but the SDK is outdated and does not know how to handle the action. Received response: " +
              JSON.stringify(body),
          )
        }
        default:
          throw new ResponseError(
            err.response,
            "The Ory API endpoint returned a response code the SDK does not know how to handle. Please check the network tab for more information. Received response: " +
              JSON.stringify(body),
          )
      }
    } else if (err instanceof FetchError) {
      throw new FetchError(
        err,
        "Unable to call the API endpoint. Ensure that CORS is set up correctly and that you have provided a valid SDK URL to Ory Elements.",
      )
    } else if (err instanceof RequiredError) {
      // TODO (@aeneasr) Happens on submit usually. Not sure how to handle yet.
    }

    throw err
  }

export async function toBody(response: Response): Promise<unknown> {
  try {
    return await response.clone().json()
  } catch (e: unknown) {
    await logResponseError(response, true, [e])
    throw new ResponseError(
      response,
      "Unable to decode API response using JSON.",
    )
  }
}

async function logResponseError(
  response: Response,
  printBody: boolean,
  wrap?: unknown[],
) {
  console.error("Unable to decode API response", {
    response: {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: printBody ? await response.clone().text() : undefined,
    },
    errors: wrap,
  })
}
