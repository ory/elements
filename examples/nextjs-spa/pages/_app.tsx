import "../styles/globals.css"
import { ThemeProvider } from "@ory/elements"
// import Ory elements css
import "@ory/elements/style.css"
import type { AppProps } from "next/app"
import React from "react"

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
