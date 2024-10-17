import { NextResponse, type NextRequest } from "next/server"
import { rewriteUrls } from "@/next/rewrite"
import {
  filterRequestHeaders,
  processSetCookieHeader,
} from "@/next/router/app/utils"
import { OryConfig } from "@/next/types"
import { defaultOmitHeaders } from "@/next/headers"

function getProjectSdkUrl(options: OryConfig) {
  let baseUrl = ""

  if (process.env.ORY_SDK_URL) {
    baseUrl = process.env.ORY_SDK_URL
  }

  if (options.orySdkUrl) {
    baseUrl = options.orySdkUrl
  }

  return baseUrl.replace(/\/$/, "")
}

async function proxyRequest(request: NextRequest, options: OryConfig) {
  const match = ["/self-service", "/sessions/whoami", "/ui"]
  if (!match.some((m) => request.nextUrl.pathname.startsWith(m))) {
    return NextResponse.next()
  }

  const matchBaseUrl = new URL(getProjectSdkUrl(options))
  const selfUrl = request.nextUrl.protocol + "//" + request.nextUrl.host

  const upstreamUrl = request.nextUrl.clone()
  upstreamUrl.hostname = matchBaseUrl.hostname
  upstreamUrl.host = matchBaseUrl.host
  upstreamUrl.protocol = matchBaseUrl.protocol
  upstreamUrl.port = matchBaseUrl.port

  const requestHeaders = filterRequestHeaders(options.forwardAdditionalHeaders)
  requestHeaders.set("Host", upstreamUrl.hostname)

  // Special headers for Ory Network URL rewrites (disabled for now):
  requestHeaders.set("X-Ory-Base-URL-Rewrite", "false")
  requestHeaders.set("Ory-Base-URL-Rewrite", "false")
  requestHeaders.set("Ory-No-Custom-Domain-Redirect", "true")

  // Fetch the upstream response
  const upstreamResponse = await fetch(upstreamUrl.toString(), {
    method: request.method,
    headers: requestHeaders,
    body:
      request.method !== "GET" && request.method !== "HEAD"
        ? await request.arrayBuffer()
        : null,
    redirect: "manual",
  })

  // Delete headers that should not be forwarded
  defaultOmitHeaders.forEach((header) => {
    upstreamResponse.headers.delete(header)
  })

  // Modify cookie domain
  if (upstreamResponse.headers.get("set-cookie")) {
    const cookies = processSetCookieHeader(
      request.nextUrl.protocol,
      upstreamResponse,
      options,
    )
    upstreamResponse.headers.delete("set-cookie")
    cookies.forEach((cookie) => {
      upstreamResponse.headers.append("Set-Cookie", cookie)
    })
  }

  // Modify location header
  if (upstreamResponse.headers.get("location")) {
    const location = rewriteUrls(
      upstreamResponse.headers.get("location") || "",
      matchBaseUrl.toString(),
      selfUrl,
      options,
    )
    upstreamResponse.headers.set("location", location)
  }

  // Modify buffer
  let modifiedBody = Buffer.from(await upstreamResponse.arrayBuffer())
  if (
    upstreamResponse.headers.get("content-type")?.includes("text/") ||
    upstreamResponse.headers.get("content-type")?.includes("application/json")
  ) {
    const bufferString = modifiedBody.toString("utf-8")
    modifiedBody = Buffer.from(
      rewriteUrls(bufferString, matchBaseUrl.toString(), selfUrl, options),
    )
  }

  // Return the modified response
  return new NextResponse(modifiedBody, {
    headers: upstreamResponse.headers,
    status: upstreamResponse.status,
  })
}

// This function can be marked `async` if using `await` inside
export function createOryMiddleware(options: OryConfig) {
  return (r: NextRequest) => {
    return proxyRequest(r, options)
  }
}
