import { OryConfig } from "./types"

export function joinUrlPaths(baseUrl: string, relativeUrl: string): string {
  return new URL(relativeUrl, baseUrl).href
}
