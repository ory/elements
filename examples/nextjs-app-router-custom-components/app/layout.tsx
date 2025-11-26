// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import "./globals.css"
import React, { Suspense, ReactNode } from "react"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <body>
        <Suspense>{children}</Suspense>
      </body>
    </html>
  )
}
