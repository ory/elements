import { headers } from "next/headers"
import { FlowType, handleFlowError, OnRedirectHandler } from "@ory/client-fetch"
import { redirect, RedirectType } from "next/navigation"
import { getSdkUrl } from "@/next/sdk"
import parse, { splitCookiesString } from "set-cookie-parser"
import { serialize, SerializeOptions as CookieSerializeOptions } from "cookie"
import { OryConfig, FlowParams, QueryParams } from "@/next/types"
import { defaultForwardedHeaders } from "@/next/headers"
import { guessCookieDomain } from "@/next/cookie"

/**
 * Get the cookie header from the HTTP request.
 *
 * @returns The cookie header.
 */
export function getCookieHeader() {
  return headers().get("cookie") ?? undefined
}

export const onRedirect: OnRedirectHandler = (url, external) => {
  redirect(url)
}

export function onValidationError<T>(value: T): T {
  return value
}

export function toFlowParams(params: QueryParams): FlowParams {
  return {
    id: params.flow,
    cookie: getCookieHeader(),
    return_to: params.return_to,
  }
}

export function redirectToBrowserEndpoint(
  params: QueryParams,
  flowType: FlowType,
) {
  // Take advantage of the fact, that Ory handles the flow creation for us and redirects the user to the default
  // return to automatically if they're logged in already.
  const redirectTo =
    getSdkUrl() +
    "/self-service/" +
    flowType.toString() +
    "/browser?" +
    new URLSearchParams(params).toString()

  return redirect(redirectTo, RedirectType.replace)
}

export const onError = (onRestartFlow: () => void) => (err: any) =>
  new Promise((resolve) => {
    handleFlowError({
      onValidationError: resolve,
      // RestartFlow and Redirect both use redirects hence we don't need to resolve here.
      onRestartFlow,
      onRedirect,
    })(err)
  })

export function filterRequestHeaders(
  forwardAdditionalHeaders?: string[],
): Headers {
  const filteredHeaders = new Headers()
  headers().forEach((value, key) => {
    const isValid =
      defaultForwardedHeaders.includes(key) ||
      (forwardAdditionalHeaders ?? []).includes(key)
    if (isValid) filteredHeaders.set(key, value)
  })

  return filteredHeaders
}

export function processSetCookieHeader(
  protocol: string,
  fetchResponse: Response,
  options: OryConfig,
) {
  const requestHeaders = headers()
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
