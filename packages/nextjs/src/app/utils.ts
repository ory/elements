// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { headers } from "next/headers"
import { QueryParams } from "../types"

export async function getCookieHeader() {
  const h = await headers()
  return h.get("cookie") ?? undefined
}

/**
 * @internal
 */
export async function toGetFlowParameter(
  params: Promise<QueryParams> | QueryParams,
) {
  return {
    id: (await params)["flow"]?.toString() ?? "",
    cookie: await getCookieHeader(),
  }
}

/**
 * A utility type that represents the query parameters of a request.
 *
 * This is needed because Next.js does not expose the query parameters as a tye.
 *
 * ```ts
 * import { OryPageParams } from "@ory/nextjs/app"
 *
 * export default async function LoginPage(props: OryPageParams) {
 *   // props.searchParams is a Promise that resolves to an object with the query parameters
 * }
 * ```
 *
 * @public
 */
export interface OryPageParams {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
