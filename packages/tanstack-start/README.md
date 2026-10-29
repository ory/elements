# @ory/tanstack-start

Ory authentication for [TanStack Start](https://tanstack.com/start). It fetches
Ory's self-service flows and the session on the server, and ships a request
middleware that serves Ory on your app's origin during local development and on
preview deployments. Render the flows with
[`@ory/elements-react`](https://www.npmjs.com/package/@ory/elements-react).

The flow and session helpers work in every environment. The proxy is for local
development and preview deployments. It isn't supported in production: through
the proxy, Ory sees your app server as the client instead of your users'
browsers. In production, use a custom domain on Ory Network, or serve Ory on
your own domain with the Ory Enterprise License, on the same site as your app.

## Install

```sh
npm install @ory/tanstack-start @ory/elements-react
```

`@tanstack/react-start` and `@tanstack/react-router` are peer dependencies.

## Configure

Set these environment variables. They are read on the server only.

| Variable                | Required | Purpose                                                                                     |
| ----------------------- | -------- | ------------------------------------------------------------------------------------------- |
| `ORY_SDK_URL`           | Yes      | The URL of your Ory project, for example `https://<slug>.projects.oryapis.com`.             |
| `ORY_PROJECT_API_TOKEN` | No       | Lets the proxy sign the app's origin as Ory's base URL, which OIDC and SAML redirects need. |

For preview deployments, create a dedicated API key, set it only in the preview
environment, and never give it a `VITE_` prefix.

## Fetch flows in server functions

TanStack Start runs route loaders on the server for the first request and in the
browser on client-side navigation. Call the helpers from a `createServerFn`
handler so they always run on the server with the browser's cookies. Define each
server function in your app, assigned to a top-level variable as shown: TanStack
Start's compiler finds server functions by that variable.

```ts
// src/ory.functions.ts
import {
  getLoginFlow,
  getOryBaseUrl,
  validateOrySearch,
} from "@ory/tanstack-start"
import { createServerFn } from "@tanstack/react-start"
import config from "./ory.config"

export const oryBaseUrlFn = createServerFn({ method: "GET" }).handler(() =>
  getOryBaseUrl(),
)

export const loginFlowFn = createServerFn({ method: "GET" })
  .validator(validateOrySearch)
  .handler(({ data }) => getLoginFlow(config, data))
```

Pass the route's search params to the server function. A flow helper returns the
flow, or throws a TanStack Router redirect when Ory must create or restart the
flow. The redirect reloads the whole page, because Ory, not the router, serves
`/self-service/<flow>/browser`.

```tsx
// src/routes/login.tsx
import { Login } from "@ory/elements-react/theme"
import { createFileRoute } from "@tanstack/react-router"
import config from "../ory.config"
import { loginFlowFn } from "../ory.functions"

export const Route = createFileRoute("/login")({
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => loginFlowFn({ data: deps }),
  component: LoginPage,
})

function LoginPage() {
  return <Login flow={Route.useLoaderData()} config={config} />
}
```

The flow helpers and `getError` attach the URL the browser uses to reach Ory to
what they return, so `@ory/elements-react` sends requests to the same URL that
the server used. `SessionProvider` fetches the session itself: load
`oryBaseUrlFn` in the root route with `staleTime: Infinity`, and pass its result
as `baseUrl`.

| Helper                         | Returns                                                |
| ------------------------------ | ------------------------------------------------------ |
| `getLoginFlow(config, search)` | The login flow.                                        |
| `getRegistrationFlow`          | The registration flow.                                 |
| `getRecoveryFlow`              | The recovery flow.                                     |
| `getVerificationFlow`          | The verification flow.                                 |
| `getSettingsFlow`              | The settings flow.                                     |
| `getServerSession()`           | The session, or `null`.                                |
| `getLogoutFlow({ returnTo })`  | A logout flow. Link to its `logout_url`.               |
| `getError(search)`             | The error Ory sent the browser to the error page with. |
| `getOryBaseUrl()`              | The URL where the browser reaches Ory.                 |

The flow, session, and base URL helpers set `Cache-Control: private, no-store`
on the response. On pages that are not 2xx, such as a 404, the header is set
only when `oryProxyMiddleware` is registered. Don't let a shared cache, such as
a CDN rule that caches every page, store flow pages or server function
responses.

## Ory URL

The browser has to reach Ory on a URL whose session cookies the app can read:
either Ory on the same site as the app, or the proxy serving Ory on the app's
own origin. The helpers resolve that URL once per request. The flow and logout
helpers use it for their redirects and links, the flow and error helpers attach
it to what they return, and `getOryBaseUrl()` returns it for the `baseUrl` prop
of `SessionProvider`.

The URL is the app's origin when the proxy handled the request, the origin is in
`trustedOrigins`, and Ory is on another site, and `ORY_SDK_URL` otherwise. No
environment name such as `NODE_ENV` changes the result, so a preview deployment,
which runs a production build, resolves like local development.

### Troubleshooting

When the browser would call Ory on another site, Ory's session cookies don't
reach the app, and the package logs a warning once in the server log:

| Warning                                                                        | Fix                                                                                                                                     |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `The Ory proxy handled a request for <origin>, which is not in trustedOrigins` | In local development or a preview deployment, add the origin to `trustedOrigins`. In production, use a custom domain on the app's site. |
| `The app (<origin>) and Ory (<url>) are on different sites`                    | The proxy didn't run for this request. Register `oryProxyMiddleware` in `src/start.ts` and call the helpers from server functions.      |
| `The request's Host header is not a valid origin`                              | Configure the reverse proxy in front of the app to forward the `Host` header the browser sent.                                          |

## Proxy Ory in local development and preview deployments

Register the middleware in `src/start.ts`, after Start's CSRF middleware. Once
`src/start.ts` defines a `startInstance`, Start no longer adds its default CSRF
middleware, so list it yourself.

```ts
// src/start.ts
import { oryProxyMiddleware } from "@ory/tanstack-start/proxy"
import { createCsrfMiddleware, createStart } from "@tanstack/react-start"
import config from "./ory.config"

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
})

const oryProxy = oryProxyMiddleware({
  ...config,
  trustedOrigins: [
    "http://localhost:3000",
    // Vercel preview deployments of the project "my-app" of the team "my-team".
    "https://my-app-*-my-team.vercel.app",
  ],
})

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware, oryProxy],
}))
```

Register it unconditionally. In production, Ory is on the same site as the app,
so the helpers use `ORY_SDK_URL` whether the proxy is registered or not.

`trustedOrigins` lists the origins your local development server and preview
deployments serve. Ory uses the reported base URL for the links in recovery and
verification emails and for redirects. An entry is an origin without a path,
such as `http://localhost:3000`. To match several origins, use `*` in the host
as a glob, such as `https://my-app-*-my-team.vercel.app`. Each `*` matches one
or more letters, digits, or hyphens and never a dot, so it stays inside one part
of the host name. A `*` can't make up the whole label right before a public
suffix from the [Public Suffix List](https://publicsuffix.org/), such as
`vercel.app` or `com`, so `https://*.vercel.app` is rejected. On a hosting
provider's domain, include your project and team in the glob, so it doesn't
match other customers' deployments. `oryProxyMiddleware` throws when it's
created and `trustedOrigins` is empty or has an invalid entry. Create it outside
the `createStart` callback, as shown, because Start runs that callback on every
request.

The proxy reports the app origin to Ory only for the origins in
`trustedOrigins`. For a request on any other origin, the proxy still forwards
Ory's paths, but it doesn't send the base URL to Ory, and the helpers use the
Ory SDK URL and log a warning. Don't add your production origin: production uses
a custom domain instead.

## Example

See
[`examples/tanstack-start`](https://github.com/ory/elements/tree/main/examples/tanstack-start).
