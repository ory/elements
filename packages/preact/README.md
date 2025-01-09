# Ory Elements

> [!CAUTION] This package is in maintenance mode and is no longer actively
> developed. Please use [`@ory/elements-react`](../elements-react/README.md)
> instead.

Ory Elements is a component library that makes building login, registration and
account pages for Ory a breeze.

- Reduces time to add complex auth flows to your customer experience, including
  multi-factor authentication and account recovery
- Themeable and modular - use only what you need from it
- Works with the React ecosystem (NextJS, React SPA, Preact SPA)
- Works with the Express based ecosystem
- Dynamically adapts the user interface to your Ory identity schema, sign-in and
  flow configuration

Ory Elements supports integrating with:

- React
- Preact
- ExpressJs (experimental)

## Getting Started

Install Ory Elements into your Preact application

```shell
npm i @ory/elements-preact --save
```

Ory Elements provides you with the ability to theme your application. Wrap your
components with `<ThemeProvider />` and import `style.css` from Ory Elements.

It is best to add this to your `main.tsx` file since it will be reused across
your project. All source code is available in the Ory Elements
[examples/preact-spa](https://github.com/ory/elements/tree/main/examples/preact-spa)
folder.

```tsx
// Ory Elements
// optional global css reset
import "@ory/elements-preact/assets/normalize.css"
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
    <ThemeProvider themeOverrides={customTheme}>
      <Router>
        <Route path="/" component={Dashboard} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Register} />
        <Route path="/verification" component={Verification} />
        <Route path="/recovery" component={Recovery} />
        <Route path="/settings" component={Settings} />
      </Router>
    </ThemeProvider>
  )
}

render(<Main />, document.getElementById("app") as HTMLElement)
```

Ory Elements supports integrating with Ory out of the box with the
`<UserAuthCard/>`, `<UserSettingsCard />` and `<UserErrorCard />`.

Each flow can be mapped using these components with only a few lines of code.

Let's create a login example, create `login.tsx`.

```tsx
export const Login = () => {
  // do sdk calls to get the flow data from Ory
  return flow ? (
    <UserAuthCard
      flow={flow}
      flowType={"login"}
      additionalProps={{
        forgotPasswordURL: "/recovery",
        signupURL: "/signup",
      }}
      title={"Login"}
      includeScripts={true}
      onSubmit={submitFormData}
    />
  ) : (
    <div>Loading...</div>
  )
}
```
