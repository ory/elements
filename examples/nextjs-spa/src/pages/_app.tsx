// Next.js
import type { AppProps } from "next/app"

// optional global css reset
import "@ory/elements/assets/normalize.css"

// Import CSS
import "@/styles/globals.css"

// Ory Elements
// optional fontawesome icons
import "@ory/elements/assets/fa-brands.min.css"
import "@ory/elements/assets/fa-solid.min.css"
import "@ory/elements/assets/fontawesome.min.css"

// optional fonts
import "@ory/elements/assets/inter-font.css"
import "@ory/elements/assets/jetbrains-mono-font.css"

// required styles for Ory Elements
import "@ory/elements/style.css"

import type { NextPage } from "next"
import type { ReactElement, ReactNode } from "react"

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // create a theme object here and add it to the `themeOverrides` below to customize Ory Elements without css overrides.
  // const theme = { ... }
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(<Component {...pageProps} />)
}
