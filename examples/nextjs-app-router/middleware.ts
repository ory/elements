// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { createCsrfMiddleware } from "@csrf-armor/nextjs"
import { createOryMiddleware } from "@ory/nextjs/middleware"
import { NextRequest, NextResponse } from "next/server"

import oryConfig from "@/ory.config"

const oryMiddleware = createOryMiddleware(oryConfig)

// Paths handled by the Ory proxy middleware; keep in sync with the
// proxyRequest match list in @ory/nextjs.
const oryPathPrefixes = [
  "/self-service",
  "/sessions/whoami",
  "/ui",
  "/.well-known/ory",
  "/.ory",
]

const csrfProtect = createCsrfMiddleware({
  strategy: "signed-double-submit",
  secret: process.env.CSRF_SECRET,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: false,
  },
  token: { fieldName: "csrf_token" },
  excludePaths: oryPathPrefixes,
})

export async function middleware(request: NextRequest) {
  const isOryPath = oryPathPrefixes.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix),
  )
  if (isOryPath) {
    return oryMiddleware(request)
  }

  const response = NextResponse.next()
  const result = await csrfProtect(request, response)
  if (!result.success) {
    return NextResponse.json(
      { error: "CSRF validation failed" },
      { status: 403 },
    )
  }
  return result.response
}

export const config = {}
