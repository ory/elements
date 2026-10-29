# `@ory/react-router`

Server-side helpers to use
[Ory Elements](https://www.npmjs.com/package/@ory/elements-react) in a
[React Router](https://reactrouter.com) application in framework mode. Works
with React Router 7.9 and later and React Router 8, which also covers Remix v2
applications that upgraded to React Router.

## Installation

```sh
npm install @ory/react-router @ory/elements-react
```

## Configuration

Set `ORY_SDK_URL` to the URL of your Ory project, for example
`https://<slug>.projects.oryapis.com`, or to your custom domain. The helpers
read it at request time, so building the application doesn't need it.

Set `ORY_PROJECT_API_TOKEN` to an
[API key](https://www.ory.com/docs/concepts/personal-access-token) of your Ory
project to use the proxy route. The proxy sends it so that Ory accepts your
application's origin as the base URL. Without it, links in recovery and
verification emails point to the Ory project URL, and social sign-in and SAML
don't return to your application. Keep the key server-side. For preview
deployments, create a dedicated API key and set it only in the preview
environment.

## Flow helpers

The flow helpers run in loaders, which only run on the server, so they work in
every environment. Each helper fetches the flow named by the `flow` query
parameter. Without one, or when the flow expired, it throws a React Router
redirect that starts a new flow.

```tsx
// app/routes/login.tsx
import { Login } from "@ory/elements-react/theme"
import "@ory/elements-react/theme/styles.css"
import { getLoginFlow } from "@ory/react-router"
import type { Route } from "./+types/login"
import config from "../ory.config"

export const headers = () => ({ "Cache-Control": "private, no-store" })

export async function loader({ request }: Route.LoaderArgs) {
  return { flow: await getLoginFlow(request, config) }
}

export default function LoginPage({ loaderData }: Route.ComponentProps) {
  return <Login flow={loaderData.flow} config={config} />
}
```

`../ory.config` exports the `OryClientConfiguration` object from
`@ory/elements-react`. The helpers read its `project` property to find the route
of each flow. The flow helpers and `getError` attach the URL the browser uses to
reach Ory to what they return, so the components reach Ory at the same URL as
the server. `SessionProvider` fetches the session itself: return
`getOryBaseUrl(request)` from the loader and pass it as `baseUrl`.

Flow pages contain CSRF tokens and URLs resolved for the request, so a shared
cache must never store them. The redirects the helpers throw carry
`Cache-Control: private, no-store`. A loader can't set the headers of its page,
so export `headers` from every route that renders a flow or session, as above.

| Export                | Use                                      |
| --------------------- | ---------------------------------------- |
| `getLoginFlow`        | Login page loader.                       |
| `getRegistrationFlow` | Registration page loader.                |
| `getRecoveryFlow`     | Recovery page loader.                    |
| `getVerificationFlow` | Verification page loader.                |
| `getSettingsFlow`     | Settings page loader.                    |
| `getServerSession`    | The session of the request, or `null`.   |
| `getLogoutFlow`       | A logout flow; link to its `logout_url`. |
| `getError`            | The error for the error page.            |
| `getOryBaseUrl`       | The URL the browser uses to reach Ory.   |

## Ory URL

The browser has to reach Ory on a URL whose session cookies the app can read:
either Ory on the same site as the app, or the proxy route serving Ory on the
app's own origin. When Ory is on the same site as the app, the URL is
`ORY_SDK_URL`. Otherwise it is the request's origin when the proxy route is
registered and the origin is in `trustedOrigins`, and `ORY_SDK_URL` if not. The
flow helpers and `getOryBaseUrl(request)` use the same URL. No environment name
such as `NODE_ENV` changes the result, so a preview deployment, which runs a
production build, resolves like local development.

### Troubleshooting

When the browser would call Ory on another site, Ory's session cookies don't
reach the app, and login or session checks fail. The helpers then log a warning
once in the server log:

| Warning                                                                        | Fix                                                                                                                                                               |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `The Ory proxy handled a request for <origin>, which is not in trustedOrigins` | In local development or a preview deployment, add the origin to `trustedOrigins` in the proxy route module. In production, use a custom domain on the app's site. |
| `The app (<origin>) and Ory (<url>) are on different sites`                    | The proxy isn't registered. Create the [proxy route](#proxy-for-local-development-and-preview-deployments) module and register its routes in `app/routes.ts`.     |
| `The request's Host header is not a valid origin`                              | Configure the reverse proxy in front of the app to forward the `Host` header the browser sent.                                                                    |

## Proxy for local development and preview deployments

Ory sets its cookies on the Ory project's domain. On `localhost` or a preview
deployment's domain, the browser doesn't send them to your application. The
proxy route serves the Ory APIs on your application's origin so that the cookies
are first-party.

The proxy is for local development and preview deployments. It isn't supported
in production: through the proxy, Ory sees every request coming from your
server's address instead of your users' browsers. In production, use a domain on
the same site as your application: a
[custom domain](https://www.ory.com/docs/guides/custom-domains) on Ory Network,
or your own domain with Ory Enterprise License. Then set `ORY_SDK_URL` to it,
and the helpers talk to Ory directly.

React Router only runs code for URLs that match a route, so the proxy is a
resource route registered on each Ory path. Create the route module:

```ts
// app/routes/ory-proxy.ts
import { createOryProxyHandler } from "@ory/react-router/proxy"
import config from "../ory.config"

const proxy = createOryProxyHandler({
  ...config,
  trustedOrigins: ["http://localhost:5173"],
})

export const loader = proxy
export const action = proxy
```

Ory uses the reported base URL for the links in recovery and verification emails
and for redirects. Set `trustedOrigins` to the origins your local development
server and preview deployments serve:

```ts
trustedOrigins: [
  // The local development server, matched exactly (scheme, host, and port).
  "http://localhost:5173",
  // Vercel preview deployments of the project "my-app" of the team "my-team".
  "https://my-app-*-my-team.vercel.app",
]
```

An entry is an origin without a path, such as `http://localhost:5173`. To match
several origins, use `*` in the host as a glob, such as
`https://my-app-*-my-team.vercel.app`. Each `*` matches one or more letters,
digits, or hyphens and never a dot, so it stays inside one part of the host
name. A `*` can't make up the whole label right before a public suffix from the
[Public Suffix List](https://publicsuffix.org/), such as `vercel.app` or `com`,
so `https://*.vercel.app` is rejected. On a hosting provider's domain, include
your project and team in the glob, so it doesn't match other customers'
deployments. `createOryProxyHandler` throws at startup when `trustedOrigins` is
unset, empty, or has an invalid entry.

The proxy serves only the origins in `trustedOrigins`. For a request on any
other origin, the proxy still serves Ory's paths, but it doesn't send the base
URL to Ory, and the flow helpers use `ORY_SDK_URL` and log a warning. Don't add
your production origin: production uses a custom domain instead.

Register it in `app/routes.ts`:

```ts
import { type RouteConfig, index, route } from "@react-router/dev/routes"
import { oryProxyRoutes } from "@ory/react-router/proxy"

export default [
  index("routes/home.tsx"),
  route("auth/login", "routes/login.tsx"),
  ...oryProxyRoutes("routes/ory-proxy.ts"),
] satisfies RouteConfig
```

The proxy route doesn't need middleware, so it works the same on React Router 7
and 8 without future flags.

Creating the handler registers the proxy for the whole process when the server
build loads. In the development server, that happens on the first request. A
process has one proxy configuration, so call `createOryProxyHandler` only in the
proxy route module, and don't serve two React Router builds with different proxy
configurations from one process. In the development server, the registration
stays after you remove the proxy routes until you restart the server.

## Example

See the
[React Router example](https://github.com/ory/elements/tree/main/examples/react-router).
