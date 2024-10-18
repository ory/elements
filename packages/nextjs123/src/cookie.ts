import { parse } from "tldjs"
import { OryConfig } from "./types"

export function guessCookieDomain(url: string | undefined, config: OryConfig) {
  if (!url || config.forceCookieDomain) {
    return config.forceCookieDomain
  }

  const parsed = parse(url || "")

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
