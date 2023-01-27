// Next.js
import type { AppProps } from "next/app"

// optional global css reset
import "@ory/elements/assets/normalize.css"

// Import CSS
import "../styles/globals.css"

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

// This is what we use to apply themes with Ory Elements.
import { Nav, ThemeProvider } from "@ory/elements"
import Head from "next/head"

export default function App({ Component, pageProps }: AppProps) {
  // create a theme object here and add it to the `themeOverrides` below to customize Ory Elements without css overrides.
  // const theme = { ... }

  return (
    <ThemeProvider themeOverrides={{}}>
      <Head>
        <title>Next.js w/ Elements</title>
        <link rel="icon" href="/ory.svg" />
      </Head>
      <div className="mainContainer">
        {/* An Ory Elements dynamic nav component */}
        <Nav
          className="main-nav"
          navTitle="Next.js w/ Elements"
          navSections={[
            {
              title: "Navigation",
              links: [
                {
                  name: "Home",
                  href: "/",
                },
                {
                  name: "Login",
                  href: "/login",
                },
                {
                  name: "Register",
                  href: "/registration",
                },
                {
                  name: "Settings",
                  href: "/settings",
                },
                {
                  name: "Verification",
                  href: "/verification",
                },
                {
                  name: "Recovery",
                  href: "/recovery",
                },
                {
                  name: "Logout",
                  href: "/logout",
                },
              ],
            },
          ]}
        />
        <div className="contentContainer">
          <Component className={"content"} {...pageProps} />
        </div>
      </div>
    </ThemeProvider>
  )
}
