// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { NextRouter } from "next/router"

export const QueryParams = (path: string): URLSearchParams => {
  const [, paramString] = path.split("?")
  // get new flow data based on the flow id in the redirect url
  return new URLSearchParams(paramString)
}

export const SetUriFlow = (router: NextRouter, id: string) => {
  // Check that current query flow id does not match requested one - pushing will trigger useEffect if router bound
  if (router.query.flow == id) {
    return
  }

  router.push(`${router.pathname}?flow=${id}`, undefined, { shallow: true })
}
