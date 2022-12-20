// React
import React from "react"

// Next.js
import type { AppProps } from "next/app"
import Head from "next/head"

// Import CSS
import "../styles/globals.css"

// Ory Elements
import "@ory/elements/style.css"
// This is what we use to apply themes with Ory Elements.
import { ThemeProvider } from "@ory/elements"

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
