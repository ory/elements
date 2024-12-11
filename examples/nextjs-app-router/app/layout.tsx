// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import "./globals.css"
import React, { Suspense, ReactNode } from "react"

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`antialiased overflow-hidden`}>
        <Suspense>{children}</Suspense>
      </body>
    </html>
  )
}
