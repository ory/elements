import { ThemeProvider } from "@ory/elements"
import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Dashboard } from "./Dashboard"
import "./index.css"
import { Login } from "./Login"
import { Recovery } from "./Recovery"
import { Registration } from "./Registration"
import { Settings } from "./Settings"
import { Verification } from "./Verification"

// import Ory elements css
import "@ory/elements/style.css"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* We add the Ory themes here */}
      <ThemeProvider themeOverrides={{}}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Registration />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/recovery" element={<Recovery />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
