import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddleware, middlewareMatchers } from "@/next/middleware"

// This function can be marked `async` if using `await` inside
export const middleware = createMiddleware({})

// See "Matching Paths" below to learn more
export const config = {
  matcher: [...middlewareMatchers],
}
