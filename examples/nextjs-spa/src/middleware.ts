// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from "next/server"

/**
 * Global middleware that checks if the user is logged in.
 * In a real world application, you would probably cache some of the results of this function.
 * But for the sake of simplicity, we do not do that here.
 * We also handle errors here and redirect the user to the login page and error page.
 *
 * @param request
 * @returns
 */
export const middleware = async (request: NextRequest) =>
  !["/", "/settings"].includes(new URL(request.url).pathname)
    ? NextResponse.next()
    : process.env.NEXT_PUBLIC_ORY_SDK_URL
    ? fetch(`${process.env.NEXT_PUBLIC_ORY_SDK_URL}/sessions/whoami`, {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      })
        .then((resp) => {
          // there must've been no response (invalid URL or something...)
          if (!resp) {
            return NextResponse.redirect(
              new URL(
                `/error?error=${JSON.stringify({
                  message:
                    "Network error - this could be related to CORS or an incorrect URL set on the `NEXT_PUBLIC_ORY_SDK_URL` environment variable. " +
                    "Please check out the Ory documentation for more information: https://www.ory.sh/docs/getting-started/local-development",
                })}`,
                request.url,
              ),
            )
          }

          console.log(
            `Global Session Middleware: ${JSON.stringify(resp.json())}`,
          )

          // the user is not signed in
          if (resp.status === 401) {
            return NextResponse.redirect(new URL("/login", request.url))
          }

          return NextResponse.next()
        })
        .catch((err) => {
          console.log(`Global Session Middleware error: ${JSON.stringify(err)}`)
          if (!err.response)
            return NextResponse.redirect(
              new URL(
                `/error?error=${JSON.stringify({
                  message:
                    "Network error - this could be related to CORS or an incorrect URL set on the `NEXT_PUBLIC_ORY_SDK_URL` environment variable. " +
                    "Please check out the Ory documentation for more information: https://www.ory.sh/docs/getting-started/local-development",
                })}`,
                request.url,
              ),
            )

          switch (err.response?.status) {
            // 422 we need to redirect the user to the location specified in the response
            case 422:
              return NextResponse.redirect(
                err.response.data.redirect_browser_to,
              )
            //return router.push("/login", { query: { aal: "aal2" } })
            case 401:
              // The user is not logged in, so we redirect them to the login page.
              return NextResponse.redirect(new URL("/login", request.url))
            case 404:
              // the SDK is not configured correctly
              // we set this up so you can debug the issue in the browser
              return NextResponse.redirect(
                new URL(`/error?error=${JSON.stringify(err)}`, request.url),
              )
            default:
              return NextResponse.redirect(
                new URL(`/error?error=${JSON.stringify(err)}`, request.url),
              )
          }
        })
    : NextResponse.redirect(
        new URL(
          `/error?error=${JSON.stringify({
            message: "NEXT_PUBLIC_ORY_SDK_URL env variable is not set",
          })}`,
          request.url,
        ),
      )
