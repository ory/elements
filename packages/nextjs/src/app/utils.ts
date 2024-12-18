// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { OnRedirectHandler } from "@ory/client-fetch"

import { QueryParams } from "../types"
import { toFlowParams as baseToFlowParams } from "../utils/utils"

export async function getCookieHeader() {
  // eslint-disable-next-line @typescript-eslint/await-thenable -- types in the next SDK are wrong?
  const h = await headers()
  return h.get("cookie") ?? undefined
}

export const onRedirect: OnRedirectHandler = (url) => {
  redirect(url)
}

export async function toFlowParams(params: QueryParams) {
  return baseToFlowParams(params, getCookieHeader)
}

export async function getPublicUrl() {
  // eslint-disable-next-line @typescript-eslint/await-thenable -- types in the next SDK are wrong?
  const h = await headers()
  const host = h.get("host")
  const protocol = h.get("x-forwarded-proto") || "http"
  return `${protocol}://${host}`
}

export interface OryPageParams {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
