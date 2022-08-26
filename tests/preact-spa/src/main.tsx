import "./index.css"
import { ThemeProvider } from "@ory/elements-preact"
import { render } from "preact"
import { Route, Router } from "wouter"
import { Dashboard } from "./app"
import { Login } from "./login"
import { Register } from "./register"
import { Recovery } from "./recovery"
import { Verification } from "./verification"
import "@ory/elements-preact/style.css"

const Main = () => {
  return (
    <ThemeProvider>
      <Router>
        <Route path="/" component={Dashboard} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Register} />
        <Route path="/verification" component={Verification} />
        <Route path="/recovery" component={Recovery} />
      </Router>
    </ThemeProvider>
  )
}

render(<Main />, document.getElementById("app") as HTMLElement)
