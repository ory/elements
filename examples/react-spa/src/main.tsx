// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  ThemeProvider,
  IntlProvider,
  CustomTranslations,
  CustomLanguageFormats,
  locales,
} from "@ory/elements"

// optional global css reset
import "@ory/elements/assets/normalize.css"

import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Dashboard } from "./Dashboard"
import { Error } from "./Error"
import "./index.css"
import { Login } from "./Login"
import { Recovery } from "./Recovery"
import { Registration } from "./Registration"
import { Settings } from "./Settings"
import { Verification } from "./Verification"

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

// adds custom translations labels to the default translations
//
// You can also contribute your custom translations to the Ory Elements project
// by submitting a pull request to the following repository:
// https://github.com/ory/elements
const customTranslations: CustomLanguageFormats = {
  en: {
    ...locales.en,
    "login.title": "Login",
    "identities.messages.1070004": "Email",
  },
  nl: {
    ...locales.nl,
    "login.title": "Inloggen",
    "identities.messages.1070004": "E-mail",
  },
  af: {
    // merging English since no default Afrikaans translations are available
    ...locales.en,
    "login.title": "Meld aan",
    "identities.messages.1070004": "E-posadres",
  },
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* We add the Ory themes here */}
      <ThemeProvider themeOverrides={{}}>
        {/* We dont need to pass any custom translations */}
        {/* <IntlProvider> */}
        {/* We pass custom translations */}
        <IntlProvider<CustomTranslations>
          locale="af"
          defaultLocale="en"
          customTranslations={customTranslations}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/recovery" element={<Recovery />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/error" element={<Error />} />
          </Routes>
        </IntlProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
