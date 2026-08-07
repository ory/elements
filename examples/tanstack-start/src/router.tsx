// SPDX-License-Identifier: Apache-2.0

import { createRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"

export function getRouter() {
  return createRouter({ routeTree, scrollRestoration: true })
}
