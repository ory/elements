// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FetchError,
  FlowType,
  GenericError,
  ResponseError,
} from "@ory/client-fetch"
import { OryErrorHandler } from "../events"
import { OnRedirectHandler } from "./continueWith"
import {
  isAddressNotVerified,
  isBrowserLocationChangeRequired,
  isCsrfError,
  isFetchError,
  isNeedsPrivilegedSessionError,
  isResponseError,
  isSelfServiceFlowExpiredError,
  isSelfServiceFlowReplaced,
} from "./error"
import { verificationUrl } from "./urlHelpers"

export type ValidationErrorHandler<T> = (body: T) => void | Promise<void>

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

  /**
   * The type of flow being handled.
   */
  flowType: FlowType

  /**
   * Optional callback invoked on infrastructure or flow-level errors before
   * the default behavior (restart, redirect) proceeds.
   */
  onError?: OryErrorHandler
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
    if (!isResponseError(err)) {
      if (isFetchError(err)) {
        const wrapped = new FetchError(
          err,
          "Unable to call the API endpoint. Ensure that CORS is set up correctly and that you have provided a valid SDK URL to Ory Elements.",
        )
        return emitUnexpectedErrorAndThrow(opts, wrapped)
      }
      return emitUnexpectedErrorAndThrow(opts, err)
    }

    // A 429 comes from the edge rate limiter, not from the flow APIs, and can
    // carry any content type (the stock Envoy response has an empty body), so it
    // is handled before content-type sniffing. It is a handled error: the caller
    // shows feedback and the form stays usable, so nothing is thrown.
    if (err.response.status === 429) {
      await opts.onError?.({
        type: "rate_limited",
        flowType: opts.flowType,
        retryAfter: parseRetryAfter(err.response.headers.get("retry-after")),
      })
      return
    }

    // First we handle any known errors in case we receive a JSON response.
    const contentType = err.response.headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
      // Handle JSON content
      let body: unknown
      try {
        body = await toBody(err.response)
      } catch (decodeError) {
        return emitUnexpectedErrorAndThrow(opts, decodeError, err.response)
      }
      if (isSelfServiceFlowExpiredError(body)) {
        await opts.onError?.({
          type: "flow_expired",
          flowType: opts.flowType,
          body,
        })
        opts.onRestartFlow(body.use_flow_id)
        return
      } else if (isAddressNotVerified(body)) {
        for (const continueWith of body.error.details?.continue_with || []) {
          if (
            continueWith.action === "show_verification_ui" &&
            continueWith.flow.url
          ) {
            opts.onRedirect(continueWith.flow.url, true)
            return
          }
        }

        opts.onRedirect(verificationUrl(opts.config), true)
        return
      } else if (
        isBrowserLocationChangeRequired(body) &&
        body.redirect_browser_to
      ) {
        opts.onRedirect(body.redirect_browser_to, true)
        return
      } else if (
        isNeedsPrivilegedSessionError(body) &&
        body.redirect_browser_to
      ) {
        opts.onRedirect(body.redirect_browser_to, true)
        return
      } else if (isSelfServiceFlowReplaced(body)) {
        await opts.onError?.({
          type: "flow_replaced",
          flowType: opts.flowType,
          body,
        })
        opts.onRestartFlow()
        return
      } else if (isCsrfError(body)) {
        await opts.onError?.({
          type: "csrf_error",
          flowType: opts.flowType,
          body,
        })
        opts.onRestartFlow()
        return
      }

      // None of the above worked, but we have a JSON response and a status code. Let's do the best we can.
      switch (err.response.status) {
        case 404: // Does not exist
          await opts.onError?.({
            type: "flow_not_found",
            flowType: opts.flowType,
          })
          opts.onRestartFlow()
          return
        case 410: // Expired
          // Re-initialize the flow
          await opts.onError?.({
            type: "flow_not_found",
            flowType: opts.flowType,
          })
          opts.onRestartFlow()
          return
        case 400:
          return opts.onValidationError(body as T)
        case 403: // This typically happens with CSRF violations.
          await opts.onError?.({
            type: "csrf_error",
            flowType: opts.flowType,
            body: body as GenericError,
          })
          opts.onRestartFlow()
          return
        case 422: {
          const error = new ResponseError(
            err.response,
            "The API returned an error code indicating a required redirect, but the SDK is outdated and does not know how to handle the action. Received response: " +
              JSON.stringify(body),
          )
          return emitUnexpectedErrorAndThrow(opts, error, err.response)
        }
      }

      const error = new ResponseError(
        err.response,
        "The Ory API endpoint returned a response code the SDK does not know how to handle. Please check the network tab for more information. Received response: " +
          JSON.stringify(body),
      )
      return emitUnexpectedErrorAndThrow(opts, error, err.response)
    } else if (
      // Not a JSON response? If it's a text response we will return an error informing the user that the response is not JSON.
      contentType.includes("text/") ||
      contentType.includes("html") ||
      contentType.includes("xml")
    ) {
      // Handle human-readable content
      await logResponseError(err.response, true)
      const error = new ResponseError(
        err.response,
        `The Ory API endpoint returned an unexpected HTML or text response. Check your console output for details.`,
      )
      return emitUnexpectedErrorAndThrow(opts, error, err.response)
    }

    // Not sure what the error is. So we just return some error.
    await logResponseError(err.response, false)
    // Handle binary/unknown content
    const error = new ResponseError(
      err.response,
      "The Ory API endpoint returned unexpected content type `" +
        contentType +
        "`.  Check your console output for details.",
    )
    return emitUnexpectedErrorAndThrow(opts, error, err.response)
  }

/**
 * Emits an `unexpected_error` event (best-effort — awaited so ordering is
 * deterministic) and then throws the given error, preserving its identity and
 * message. Centralizes the emit-then-throw shape used at every
 * `handleFlowError` throw site.
 *
 * The observer call is wrapped so a throwing `onError` cannot mask the original
 * error: the whole point of this event is to surface `error`, so an observer
 * failure must not replace it.
 */
async function emitUnexpectedErrorAndThrow<T>(
  opts: FlowErrorHandlerProps<T>,
  error: unknown,
  response?: Response,
): Promise<never> {
  try {
    await opts.onError?.({
      type: "unexpected_error",
      flowType: opts.flowType,
      ...(response ? { response } : {}),
      error,
    })
  } catch (observerError) {
    console.error(
      "[@ory/elements-react] The onError callback threw while handling an unexpected_error event. Ignoring it so the original error is preserved.",
      observerError,
    )
  }
  throw error
}

export async function toBody(response: Response): Promise<unknown> {
  try {
    return await response.clone().json()
  } catch (e: unknown) {
    await logResponseError(response, true, [e])
    throw new ResponseError(
      response,
      "[@ory/elements-react] Unable to decode API response using JSON. The Ory SDK URL may point to something other than the Ory APIs. The response status, headers, and body are logged to the console.",
    )
  }
}

async function logResponseError(
  response: Response,
  printBody: boolean,
  wrap?: unknown[],
) {
  console.error("[@ory/elements-react] Unable to decode API response", {
    response: {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: printBody ? await response.clone().text() : undefined,
    },
    errors: wrap,
  })
}

// Parses the numeric (delta-seconds) form of the Retry-After header. The
// HTTP-date form is rare on rate limit responses and is ignored.
function parseRetryAfter(value: string | null): number | undefined {
  if (!value) {
    return undefined
  }
  const seconds = Number(value)
  return Number.isFinite(seconds) && seconds >= 0 ? seconds : undefined
}
