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
- Express.js (experimental)

## Getting Started

Install Ory Elements into your Express.js application

```shell
npm i @ory/elements-markup --save
```

In Express.js we can render the component server-side and inject the rendered
HTML into the page using a template rendering engine. In this case, we could use
Handlebars.js.

An important feature of Ory Elements is theming, which can be done through its
css variables.

In Express.js Ory Elements provides us with helper routes to expose static css
files as well as a way to override those css variables to essentially theme the
page.

Create a route for static files `static.ts`.

```ts
export const registerStaticRoutes: RouteRegistrator = (app) => {
  RegisterOryElementsExpress(app, {
    ...defaultLightTheme, // we can add new theming variables
  })
}
```

Create a view template called `login.hbs` which will accept raw HTML through the
`card` property.

```hbs
<div id="login">
  {{{card}}}
</div>
```

Create a new login route in `login.ts` which does all the logic for the login
flow.

```ts
// do sdk calls to get the flow data
// render the view template `login.hbs`
res.render("login", {
  card: UserAuthCard({
    title: !(flow.refresh || flow.requested_aal === "aal2")
      ? "Sign In"
      : "Two-Factor Authentication",
    ...(flow.hydra_login_request && {
      subtitle: `To authenticate ${
        flow.hydra_login_request.client_client_name ||
        flow.hydra_login_request.client_client_id
      }`,
    }),
    flow: flow as SelfServiceFlow,
    flowType: "login",
    cardImage: "ory-logo.svg",
    additionalProps: {
      forgotPasswordURL: "recovery",
      signupURL: initRegistrationUrl,
      logoutURL: logoutUrl,
    },
  }),
})
```

An example implementing Ory Elements can be found at
[ory/kratos-selfservice-ui-node](https://github.com/ory/kratos-selfservice-ui-node/)
on GitHub.
