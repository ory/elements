// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { createCsrfMiddleware } from "@csrf-armor/nextjs"
import { createOryMiddleware } from "@ory/nextjs/middleware"
import { NextRequest, NextResponse } from "next/server"

import oryConfig from "@/ory.config"

const oryMiddleware = createOryMiddleware(oryConfig)

const csrfProtect = createCsrfMiddleware({
  strategy: "signed-double-submit",
  secret: process.env.CSRF_SECRET,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: false,
  },
  token: { fieldName: "csrf_token" },
  excludePaths: ["/self-service", "/sessions", "/.well-known", "/.ory"],
})

const oryPathPrefixes = [
  "/self-service/",
  "/sessions/",
  "/.well-known/",
  "/.ory/",
]

export async function middleware(request: NextRequest) {
  // Type cast needed due to Next.js version differences between packages
  const oryResponse = await oryMiddleware(
    request as Parameters<typeof oryMiddleware>[0],
  )

  const isOryPath = oryPathPrefixes.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix),
  )
  if (isOryPath) {
    return oryResponse
  }

  const response = NextResponse.next()
  const result = await csrfProtect(
    request as Parameters<typeof csrfProtect>[0],
    response as Parameters<typeof csrfProtect>[1],
  )
  if (!result.success) {
    return NextResponse.json(
      { error: "CSRF validation failed" },
      { status: 403 },
    )
  }
  return response
}

export const config = {}
