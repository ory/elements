// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
"use server"
export { getLoginFlow } from "./login"
export { oryAppRouterConfig } from "./config"

export interface OryPageParams {
  searchParams: URLSearchParams
}
