// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className={`antialiased overflow-hidden`}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
