import {
  CustomLanguageFormats,
  CustomTranslations,
  IntlProvider,
  Nav,
  ThemeProvider,
} from "@ory/elements"
import Head from "next/head"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  // adds custom translations labels to the default translations
  // this merges the custom translations with the default translations
  // if a custom language is provided, but no standard translation
  // exists, the english translation will be merged instead for missing values.
  //
  // For example, if you provide a custom translation for the "login.title" label
  // in the "af" language (Afrikaans), but no standard translation exists for "af",
  // the english translation will be used for the remaining labels.
  //
  // You can also contribute your custom translations to the Ory Elements project
  // by submitting a pull request to the following repository:
  // https://github.com/ory/elements
  const customTranslations: CustomLanguageFormats = {
    en: {
      "login.title": "Login",
      "identities.messages.1070004": "Email",
    },
    nl: {
      "login.title": "Inloggen",
      "identities.messages.1070004": "E-mail",
    },
    af: {
      "login.title": "Meld aan",
      "identities.messages.1070004": "E-posadres",
    },
  }
  return (
    <ThemeProvider themeOverrides={{}}>
      {/* We dont need to pass any custom translations */}
      {/* <IntlProvider> */}
      {/* We pass custom translations */}
      <IntlProvider<CustomTranslations>
        customTranslations={customTranslations}
        locale="af"
        defaultLocale="en"
      >
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
      </IntlProvider>
    </ThemeProvider>
  )
}
