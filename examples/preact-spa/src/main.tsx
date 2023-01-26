import { ThemeProvider } from "@ory/elements-preact"
import { render } from "preact"
import { Route, Router } from "wouter"
import { Dashboard } from "./app"
import "./index.css"
import { Login } from "./login"
import { Recovery } from "./recovery"
import { Register } from "./register"
import { Settings } from "./settings"
import { Verification } from "./verification"
import { Error } from "./error"

// import Ory elements css
import "@ory/elements-preact/style.css"

const Main = () => {
  return (
    <ThemeProvider>
      <Router>
        <Route path="/" component={Dashboard} />
        <Route path="/login" component={Login} />
        <Route path="/registration" component={Register} />
        <Route path="/verification" component={Verification} />
        <Route path="/recovery" component={Recovery} />
        <Route path="/settings" component={Settings} />
        <Route path="/error" component={Error} />
      </Router>
    </ThemeProvider>
  )
}

render(<Main />, document.getElementById("app") as HTMLElement)
