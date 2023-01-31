// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export const QueryParams = (path: string): URLSearchParams => {
  const [, paramString] = path.split("?")
  // get new flow data based on the flow id in the redirect url
  return new URLSearchParams(paramString)
}
