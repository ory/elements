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
  new URL(request.url).pathname !== "/"
    ? NextResponse.next()
    : fetch(`${process.env.NEXT_PUBLIC_ORY_SDK_URL}/sessions/whoami`, {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      })
        .then(() => NextResponse.next())
        .catch((err) => {
          console.error(`Global Middleware: ${err}`)
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
