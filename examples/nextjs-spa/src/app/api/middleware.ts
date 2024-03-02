// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import csrf from "edge-csrf"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// initalize protection function
const csrfProtect = csrf({
  cookie: {
    secure: process.env.NODE_ENV === "production",
    // CHANGE ME
    name: "_elements_nextjs_csrf",
    // CHANGE ME
    sameSite: "lax",
  },
})

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // csrf protection
  const csrfError = await csrfProtect(request, response)

  // check result
  if (csrfError) {
    return new NextResponse("invalid csrf token", { status: 403 })
  }

  return response
}
