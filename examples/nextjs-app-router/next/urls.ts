import { Config } from "./types"

export function getSdkUrl(options: Config) {
  let baseUrl = ""

  if (process.env.ORY_SDK_URL) {
    baseUrl = process.env.ORY_SDK_URL
  }

  if (options.orySdkUrl) {
    baseUrl = options.orySdkUrl
  }

  return baseUrl.replace(/\/$/, "")
}

export function joinUrlPaths(baseUrl: string, relativeUrl: string): string {
  const base = new URL(baseUrl)
  const fullUrl = new URL(relativeUrl, base)

  return fullUrl.href
}
