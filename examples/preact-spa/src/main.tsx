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
import { IntlProvider, ThemeProvider } from "@ory/elements-preact"

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
  return (
    <ThemeProvider>
      <IntlProvider>
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
