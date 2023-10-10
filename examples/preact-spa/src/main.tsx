// optional global css reset
import "@ory/elements-preact/assets/normalize.css"

import { render } from "preact"
import { Route, Router } from "wouter/preact"
import { Dashboard } from "./app"
import { Error } from "./error"
import "./index.css"
import { Login } from "./login"
import { Recovery } from "./recovery"
import { Register } from "./register"
import { Settings } from "./settings"
import { Verification } from "./verification"
import {
  CustomLanguageFormats,
  CustomTranslations,
  IntlProvider,
  ThemeProvider,
} from "@ory/elements-preact"

// Ory Elements
// optional fontawesome icons
import "@ory/elements-preact/assets/fa-brands.min.css"
import "@ory/elements-preact/assets/fa-solid.min.css"
import "@ory/elements-preact/assets/fontawesome.min.css"

// optional fonts
import "@ory/elements-preact/assets/inter-font.css"
import "@ory/elements-preact/assets/jetbrains-mono-font.css"

// required styles for Ory Elements
import "@ory/elements-preact/style.css"

const Main = () => {
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
    <ThemeProvider>
      {/* We dont need to pass any custom translations */}
      {/* <IntlProvider> */}
      {/* We pass custom translations */}
      <IntlProvider<CustomTranslations>
        customTranslations={customTranslations}
        locale="af"
        defaultLocale="en"
      >
        <Router>
          <Route path="/" component={Dashboard} />
          <Route path="/login" component={Login} />
          <Route path="/registration" component={Register} />
          <Route path="/verification" component={Verification} />
          <Route path="/recovery" component={Recovery} />
          <Route path="/settings" component={Settings} />
          <Route path="/error" component={Error} />
        </Router>
      </IntlProvider>
    </ThemeProvider>
  )
}

render(<Main />, document.getElementById("app") as HTMLElement)
