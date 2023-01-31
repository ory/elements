import { ThemeProvider } from "@ory/elements"

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

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* We add the Ory themes here */}
      <ThemeProvider themeOverrides={{}}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/recovery" element={<Recovery />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/error" element={<Error />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
