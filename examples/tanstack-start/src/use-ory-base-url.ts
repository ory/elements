// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { getRouteApi } from "@tanstack/react-router"

const rootRoute = getRouteApi("__root__")

export function useOryBaseUrl() {
  return rootRoute.useLoaderData()
}
