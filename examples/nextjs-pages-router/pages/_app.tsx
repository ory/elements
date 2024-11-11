// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import "@/styles/globals.css"
import type { AppProps } from "next/app"

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
