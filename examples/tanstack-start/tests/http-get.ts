// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { get } from "node:http"

// `fetch` ignores a custom `Host` header.
export function httpGet(
  url: string,
  headers: Record<string, string> = {},
): Promise<Response> {
  return new Promise((resolve, reject) => {
    get(url, { headers }, (res) => {
      const chunks: Buffer[] = []
      res.on("data", (chunk: Buffer) => chunks.push(chunk))
      res.on("error", reject)
      res.on("end", () => {
        const responseHeaders = new Headers()
        for (const [name, value] of Object.entries(res.headers)) {
          for (const item of [value ?? []].flat()) {
            responseHeaders.append(name, item)
          }
        }
        resolve(
          new Response(Buffer.concat(chunks), {
            status: res.statusCode,
            headers: responseHeaders,
          }),
        )
      })
    }).on("error", reject)
  })
}
