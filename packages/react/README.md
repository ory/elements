# Ory Elements

An extensive component library for custom UI integration and development with
[Ory Network](https://www.ory.sh/cloud/) and
[Ory Self-hosted](https://github.com/ory) with full support for the React
ecosystem.

## Getting Started

Install Ory Elements into your React application

```shell
npm i @ory/elements --save
```

Ory Elements provides you with the ability to theme your application. Wrap your
components with `<ThemeProvider />` and import `style.css` from Elements.

It is best to add this to your `main.tsx` file since it will be reused across
your project. All source code is available in the Ory Elements
[examples/react-spa](https://github.com/ory/elements/tree/main/examples/react-spa)
folder.

```tsx
// other imports here
// import our Ory elements css
import "@ory/elements/style.css"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* We add the Ory themes here */}
      <ThemeProvider themeOverrides={customTheme}>
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
```

Ory Elements supports integrating with Ory out of the box with the
`<UserAuthCard/>`, `<UserSettingsCard />` and `<UserErrorCard />`.

Each flow can be mapped using these compontents with only a few lines of caode.

Let's create a login example, create `login.tsx`.

```tsx
exoort const Login = () => {
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
