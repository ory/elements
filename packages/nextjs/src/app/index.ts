// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
"use server"
import { getLoginFlow } from "./login"

export { getLoginFlow }

export interface OryPageParams {
  searchParams: URLSearchParams
}
