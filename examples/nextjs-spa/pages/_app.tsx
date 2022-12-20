import "../styles/globals.css"
import { ThemeProvider } from "@ory/elements"
// import Ory elements css
import "@ory/elements/style.css"
import type { AppProps } from "next/app"
import React from "react"
import Head from "next/head"

export default function App({ Component, pageProps }: AppProps) {
  // create a theme object here and add it to the `themeOverrides` below to customize Ory Elements without css overrides.
  // const theme = { ... }
  return (
    <div>
    <Head>
      <title>Next.js w/ Elements</title>
      <link rel="icon" href="/ory.svg" />
    </Head>
      <React.StrictMode>
        <ThemeProvider themeOverrides={{}}>
          <Component {...pageProps} />
        </ThemeProvider>
      </React.StrictMode>
    </div>
  )
}
