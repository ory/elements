import { ApiResponse } from "@ory/client-fetch"
import { FlowParams, OryConfig, QueryParams } from "./types"
import { FlowType, handleFlowError, OnRedirectHandler } from "@ory/client-fetch"
import { getSdkUrl } from "./sdk"
import { guessCookieDomain } from "./cookie"
import { parse, splitCookiesString } from "set-cookie-parser"
import { serialize, SerializeOptions as CookieSerializeOptions } from "cookie"
import { defaultForwardedHeaders } from "./headers"

export function onValidationError<T>(value: T): T {
  return value
}

export function toFlowParams(
  params: QueryParams,
  getCookieHeader: () => string | undefined,
): FlowParams {
  return {
    id: params["flow"],
    cookie: getCookieHeader(),
    return_to: params["return_to"],
  }
}

export const toBrowserEndpointRedirect = (
  params: QueryParams,
  flowType: FlowType,
) =>
  getSdkUrl() +
  "/self-service/" +
  flowType.toString() +
  "/browser?" +
  new URLSearchParams(params).toString()

export const onError =
  (onRestartFlow: () => void, onRedirect: OnRedirectHandler) => (err: any) =>
    new Promise((resolve) => {
      handleFlowError({
        onValidationError: resolve,
        // RestartFlow and Redirect both use redirects hence we don't need to resolve here.
        onRestartFlow,
        onRedirect,
      })(err)
    })

export function processSetCookieHeaders(
  protocol: string,
  fetchResponse: Response,
  options: OryConfig,
  requestHeaders: Headers,
) {
  const isTls =
    protocol === "https:" || requestHeaders.get("x-forwarded-proto") === "https"

  const secure = false

  const forwarded = requestHeaders.get("x-forwarded-host")
  const host = forwarded ? forwarded : requestHeaders.get("host")
  const domain = guessCookieDomain(host ?? "", options)

  return parse(
    splitCookiesString(fetchResponse.headers.get("set-cookie") || ""),
  )
    .map((cookie) => ({
      ...cookie,
      domain,
      secure,
      encode: (v: string) => v,
    }))
    .map(({ value, name, ...options }) =>
      serialize(name, value, options as CookieSerializeOptions),
    )
}

export function filterRequestHeaders(
  headers: Headers,
  forwardAdditionalHeaders?: string[],
): Headers {
  const filteredHeaders = new Headers()

  headers.forEach((value, key) => {
    const isValid =
      defaultForwardedHeaders.includes(key) ||
      (forwardAdditionalHeaders ?? []).includes(key)
    if (isValid) filteredHeaders.set(key, value)
  })

  return filteredHeaders
}

export function toValue<T>(res: ApiResponse<T>) {
  return res.value()
}
