import tldjs from "tldjs"
import { Config } from "./types"

export function guessCookieDomain(url: string | undefined, config: Config) {
  if (!url || config.forceCookieDomain) {
    return config.forceCookieDomain
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
