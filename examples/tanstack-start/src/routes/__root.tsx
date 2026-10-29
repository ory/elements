// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import "@ory/elements-react/theme/styles.css"
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router"
import type { ReactNode } from "react"
import { oryBaseUrlFn } from "../ory.functions"
import appCss from "../styles.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ory TanStack Start Example" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  loader: () => oryBaseUrlFn(),
  staleTime: Infinity,
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
