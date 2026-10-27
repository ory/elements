// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export {
  handleOryProxy,
  isOryProxyPath,
  oryProxyPaths,
  type OryProxyOptions,
} from "./proxy"
export { guessCookieDomain } from "./cookie"
export { rewriteUrls } from "./rewrite"
export { parseOrigin } from "../url"
export { checkTrustedOrigins, isTrustedOrigin } from "./trusted-origin"
export {
  filterRequestHeaders,
  joinUrlPaths,
  processSetCookieHeaders,
} from "./utils"
