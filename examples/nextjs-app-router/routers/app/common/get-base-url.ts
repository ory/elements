import { type CreateApiHandlerOptions } from "../type/create-api-handler-options"

export function getBaseUrl(options: CreateApiHandlerOptions) {
  let baseUrl = ""

  if (process.env.ORY_SDK_URL) {
    baseUrl = process.env.ORY_SDK_URL
  }

  if (options.orySdkUrl) {
    baseUrl = options.orySdkUrl
  }

  return baseUrl.replace(/\/$/, "")
}
export { CreateApiHandlerOptions }
