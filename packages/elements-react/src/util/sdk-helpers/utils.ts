// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FetchError, RequiredError, ResponseError } from "../"
import { OnRedirectHandler } from "./continueWith"
import {
  isBrowserLocationChangeRequired,
  isCsrfError,
  isNeedsPrivilegedSessionError,
  isResponseError,
  isSelfServiceFlowExpiredError,
} from "./error"

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
      switch (err.response.status) {
        case 404: // Does not exist
          opts.onRestartFlow()
          return
        case 410: // Expired
          const body = await toBody(err.response)
          if (isSelfServiceFlowExpiredError(body)) {
            opts.onRestartFlow(body.use_flow_id)
            return
          }
          // Re-initialize the flow
          opts.onRestartFlow()
          return
        case 400:
          return opts.onValidationError(
            // TODO: maybe we can do actual type checking here?
            (await err.response.json()) as unknown as T,
          )
        case 403: // This typically happens with CSRF violations.
        case 422: {
          const body = await toBody(err.response)
          if (
            isBrowserLocationChangeRequired(body) &&
            body.redirect_browser_to
          ) {
            opts.onRedirect(body.redirect_browser_to, true)
            return
          } else if (isSelfServiceFlowExpiredError(body)) {
            opts.onRestartFlow(body.use_flow_id)
            return
          } else if (isNeedsPrivilegedSessionError(body)) {
            opts.onRedirect(body.redirect_browser_to, true)
            return
          } else if (isCsrfError(body)) {
            opts.onRestartFlow()
            return
          }

          throw new ResponseError(
            err.response,
            "The Ory API endpoint returned a response code the SDK does not know how to handle. Please check the network tab for more information:" +
              JSON.stringify(body),
          )
        }

        default:
          throw new ResponseError(
            err.response,
            "The Ory API endpoint returned a response code the SDK does not know how to handle. Please check the network tab for more information.",
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
    return (await response.clone().json()) as unknown
  } catch (e) {
    throw new ResponseError(
      response,
      "The Ory API endpoint returned a response the SDK does not know how to handle:" +
        (await response.text()),
    )
  }
}
