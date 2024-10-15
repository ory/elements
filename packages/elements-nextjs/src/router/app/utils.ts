import { getCookieHeader } from "$/utils/headers"
import { ApiResponse } from "@ory-corp/client"
import { FlowType, handleFlowError, OnRedirectHandler } from "@ory/client-fetch"
import { redirect, RedirectType } from "next/navigation"

export type QueryParams = { [key: string]: any }

export const initOverrides: RequestInit = {
  cache: "no-cache",
}

export function toValue<T>(res: ApiResponse<T>) {
  return res.value()
}

export const onRedirect: OnRedirectHandler = (url, external) => {
  redirect(url)
}

export function onValidationError<T>(value: T): T {
  return value
}

export type ParsedQueryParams = {
  id: string
  cookie: string | undefined
  return_to: string
}

export function requestParams(params: QueryParams): ParsedQueryParams {
  return {
    id: params.flow,
    cookie: getCookieHeader(),
    return_to: params.return_to,
  }
}

export function init(params: QueryParams, flowType: FlowType) {
  // Take advantage of the fact, that Ory handles the flow creation for us and redirects the user to the default
  // return to automatically if they're logged in already.
  return redirect(
    "/self-service/" +
      flowType.toString() +
      "/browser?" +
      new URLSearchParams(params).toString(),
    RedirectType.replace,
  )
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
