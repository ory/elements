import { Nav, ThemeProvider } from "@ory/elements"
import Head from "next/head"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
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
          <div className="content">{children}</div>
        </div>
      </div>
    </ThemeProvider>
  )
}
