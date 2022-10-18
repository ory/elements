# Ory Elements

An extensive component library for custom UI integration and development with
[Ory Network](https://www.ory.sh/cloud/) and
[Ory Self-hosted](https://github.com/ory) with full support for the React
ecosystem.

## Getting Started

Install Elements into your Preact application

```shell
npm i @ory/elements-preact --save
```

Ory Elements provides you with the ability to theme your application. Wrap your
components with `<ThemeProvider />` and import `style.css` from Elements.

It is best to add this to your `main.tsx` file since it will be reused across
your project. All source code is available in the Ory Elements
[examples/preact-spa](https://github.com/ory/elements/tree/main/examples/preact-spa)
folder.

```tsx
// import Ory elements css
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

Each flow can be mapped using these compontents with only a few lines of caode.

Let's create a login example, create `login.tsx`.

```tsx
export const Login = () => {
    // do sdk calls to Ory to get the flow data
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
      onSubmit={({ body }) => {
        // do an sdk call to Ory to submit the form data
      }}
    />
  ) : (
    <div>Loading...</div>
  )
}