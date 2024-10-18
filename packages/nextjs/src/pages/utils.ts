import { headers } from "next/headers"
import { FlowType, OnRedirectHandler } from "@ory/client-fetch"
import { useRouter } from "next/router"
import { QueryParams } from "@/nextjs/types"
import {
  toBrowserEndpointRedirect,
  toFlowParams as baseToFlowParams,
} from "@/nextjs/utils"

export function getCookieHeader(): string | undefined {
  throw Error("onRedirect")
}

export const onRedirect: OnRedirectHandler = (url, external) => {
  throw Error("onRedirect")
}

export function toFlowParams(params: QueryParams) {
  return baseToFlowParams(params, getCookieHeader)
}

export function redirectToBrowserEndpoint(
  params: QueryParams,
  flowType: FlowType,
) {
  const router = useRouter()
  // Take advantage of the fact, that Ory handles the flow creation for us and redirects the user to the default
  // return to automatically if they're logged in already.
  return router.replace(toBrowserEndpointRedirect(params, flowType))
}

export function setValuesFromSearchParams<T>(
  params: URLSearchParams,
  obj: T,
): T {
  const result = { ...obj }

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase()
      if (params.has(snakeKey)) {
        ;(result as any)[key] = params.get(snakeKey)
      }
    }
  }

  return result
}
