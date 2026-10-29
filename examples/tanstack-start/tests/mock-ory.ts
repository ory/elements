// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { createServer, type Server } from "node:http"
import type { AddressInfo } from "node:net"

export const flowId = "6bd25ba1-8c3c-4b0c-9a21-3c1a3f6c2b5e"
export const expiresAt = "2026-10-16T15:30:00.123Z"
export const issuedAt = "2026-10-16T15:00:00.123Z"

function loginFlow(origin: string) {
  return {
    id: flowId,
    type: "browser",
    expires_at: expiresAt,
    issued_at: issuedAt,
    request_url: `${origin}/self-service/login/browser`,
    state: "choose_method",
    ui: {
      action: `${origin}/self-service/login?flow=${flowId}`,
      method: "POST",
      nodes: [
        {
          type: "input",
          group: "default",
          attributes: {
            name: "csrf_token",
            type: "hidden",
            value: "token",
            required: true,
            disabled: false,
            node_type: "input",
          },
          messages: [],
          meta: {},
        },
      ],
    },
  }
}

export type MockOry = {
  url: string
  requests: URL[]
  close: () => Promise<void>
}

export async function startMockOry(): Promise<MockOry> {
  const requests: URL[] = []
  const server: Server = createServer((req, res) => {
    const origin = `http://${req.headers.host}`
    const url = new URL(req.url ?? "/", origin)
    requests.push(url)

    if (url.pathname === "/self-service/login/flows") {
      res.writeHead(200, { "content-type": "application/json" })
      res.end(JSON.stringify(loginFlow(origin)))
      return
    }
    if (url.pathname === "/self-service/login/browser") {
      res.writeHead(303, { location: `${origin}/ui/login?flow=${flowId}` })
      res.end()
      return
    }
    res.writeHead(401, { "content-type": "application/json" })
    res.end(JSON.stringify({ error: { code: 401, message: "Unauthorized" } }))
  })
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  const { port } = server.address() as AddressInfo

  return {
    url: `http://127.0.0.1:${port}`,
    requests,
    close: () =>
      new Promise<void>((resolve, reject) =>
        server.close((err) => (err ? reject(err) : resolve())),
      ),
  }
}
