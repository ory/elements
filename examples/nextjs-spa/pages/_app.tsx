import "../styles/globals.css"
import { ThemeProvider } from "@ory/elements"
// import Ory elements css
import "@ory/elements/style.css"
import type { AppProps } from "next/app"
import React from "react"

export default function App({ Component, pageProps }: AppProps) {
  return (
    // create a recovery form that dynamically renders based on the flow data using Ory Elements
    <React.StrictMode>
      {/* We add the Ory themes here */}
      <ThemeProvider themeOverrides={{}}>
        <Component {...pageProps} />
      </ThemeProvider>
    </React.StrictMode>
  )
}
