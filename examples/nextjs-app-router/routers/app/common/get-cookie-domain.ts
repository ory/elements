import tldjs from "tldjs"
import { CreateApiHandlerOptions } from "./get-base-url"
import { isVercelAppDeployment } from "@/platforms/vercel"

export function guessCookieDomain(
  url: string | undefined,
  options: CreateApiHandlerOptions,
) {
  if (!url || options.forceCookieDomain) {
    return options.forceCookieDomain
  }

  const parsed = tldjs.parse(url || "")

  if (!parsed.isValid || parsed.isIp) {
    return undefined
  }

  if (parsed.publicSuffix) {
    // We can't set the cookie for public domain suffixes.
    return undefined
  }

  if (!parsed.domain) {
    return parsed.hostname
  }

  return parsed.domain
}
