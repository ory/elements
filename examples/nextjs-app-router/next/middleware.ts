import { NextResponse, type NextRequest, NextMiddleware } from "next/server"
import { rewriteUrls } from "@/next/rewrite"
import {
  filterRequestHeaders,
  processSetCookieHeader,
} from "@/next/router/app/utils"
import { getSdkUrl } from "@/next/urls"
import { Config } from "@/next/types"

async function proxyRequest(request: NextRequest, options: Config) {
  const baseUrl = getSdkUrl(options)

  const path = request.nextUrl.pathname
  const url = new URL(path, baseUrl)
  url.search = request.nextUrl.search

  const requestHeaders = filterRequestHeaders(options.forwardAdditionalHeaders)

  requestHeaders.set("X-Ory-Base-URL-Rewrite", "false")
  requestHeaders.set("Ory-Base-URL-Rewrite", "false")
  requestHeaders.set("Ory-No-Custom-Domain-Redirect", "true")

  const response = await fetch(url, {
    method: request.method,
    headers: requestHeaders,
    body:
      request.method !== "GET" && request.method !== "HEAD"
        ? await request.arrayBuffer()
        : null,
    redirect: "manual",
  })

  const responseHeaders = new Headers()
  response.headers.forEach((v, k) => responseHeaders.append(k, v))

  responseHeaders.delete("location")
  responseHeaders.delete("set-cookie")
  if (response.headers.get("set-cookie")) {
    const cookies = processSetCookieHeader(
      request.nextUrl.protocol,
      response,
      options,
    )
    cookies.forEach((cookie) => {
      responseHeaders.append("Set-Cookie", cookie)
    })
  }

  if (response.headers.get("location")) {
    const location = rewriteUrls(
      response.headers.get("location") || "",
      baseUrl,
      options,
    )
    responseHeaders.set("location", location)
  }

  responseHeaders.delete("transfer-encoding")
  responseHeaders.delete("content-encoding")
  responseHeaders.delete("content-length")

  let responseBuffer = Buffer.from(await response.arrayBuffer())
  if (
    response.headers.get("content-type")?.includes("text/") ||
    response.headers.get("content-type")?.includes("application/json")
  ) {
    const bufferString = responseBuffer.toString("utf-8")
    responseBuffer = Buffer.from(rewriteUrls(bufferString, baseUrl, options))
  }

  return new NextResponse(responseBuffer, {
    status: response.status,
    headers: responseHeaders,
  })
}

// This function can be marked `async` if using `await` inside
export function createMiddleware(options: Config) {
  return (r: NextRequest) => {
    return proxyRequest(r, options)
  }
}

export const middlewareMatchers = ["/(self-service|ui)(.*)"]
