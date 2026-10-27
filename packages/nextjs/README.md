# `@ory/nextjs`

This package contains the Next.js SDK for Ory. It provides a middleware,
server-side functions for the app router, and hooks for the pages router to
interact with the Ory ecosystem.

> [!NOTE]  
> This package's primary use case is for developing custom components for login,
> registration, verification, settings, recovery, or consent. For integrating
> authentication without changing the UI, follow our
> [guide for Auth.js](https://www.ory.com/docs/getting-started/integrate-auth/auth-js).

## Use case

The package has two parts:

- The functions in `@ory/nextjs/app` fetch flows and sessions, and the hooks in
  `@ory/nextjs/pages` fetch flows, for your custom UI. They work in every
  deployment, on Ory Network and on the Ory Enterprise License (OEL).
- The middleware in `@ory/nextjs/middleware` is for local development and
  preview deployments, where your application and Ory are on different sites. In
  production, put Ory on your application's domain: a
  [custom domain](https://www.ory.com/docs/guides/custom-domains) (CNAME) on Ory
  Network, or your own domains on OEL.

This package includes a middleware for the app and page router that enables
local development and preview environments to work with
[Ory's cookie security model](https://www.ory.com/docs/security-model). The
middleware serves the Ory APIs on your application's own origin.

> [!WARNING]  
> Don't run Ory Tunnel and don't set the SDK URL to `http://localhost:4000` when
> you use the `@ory/nextjs` middleware. Guides that tell you to start
> `ory tunnel` for local development describe integrations without this package.
> Set `NEXT_PUBLIC_ORY_SDK_URL` to the URL of your Ory APIs instead: the Ory
> Network project URL or custom domain, or the domain you serve Ory on with OEL.

## Installation

Run `npm install @ory/nextjs` or `yarn add @ory/nextjs` to install the package.
To render the flows, also install
[`@ory/elements-react`](https://www.npmjs.com/package/@ory/elements-react).

## Configuration

Set `NEXT_PUBLIC_ORY_SDK_URL` to the URL of your Ory APIs: on Ory Network, the
project SDK URL or the project's custom domain; on OEL, the domain you serve Ory
on. `ORY_SDK_URL` is read as a fallback.

Set `ORY_PROJECT_API_TOKEN` to an
[API key](https://www.ory.com/docs/concepts/personal-access-token) of your Ory
project. The middleware sends it so that Ory accepts your application's origin
as the base URL. Without it, links in recovery and verification emails point to
the Ory project URL, and social sign-in and SAML don't return to your
application. Keep the key server-side: don't prefix it with `NEXT_PUBLIC_`. For
preview deployments, create a dedicated API key and set it only in the preview
environment.

## Usage

Create the middleware. `trustedOrigins` is required: `createOryMiddleware`
throws when it is unset, empty, or has an invalid entry. List the local
development origin as an exact origin, and your preview deployments as a glob
that includes your project and team. In a glob, `*` matches one or more letters,
digits, or hyphens and never a dot, and it can't make up the whole label right
before a public suffix from the [Public Suffix List](https://publicsuffix.org/),
such as `vercel.app` or `com`: `https://*.vercel.app` is rejected.

The middleware serves only the origins in `trustedOrigins`. For any other
origin, the flow functions use `NEXT_PUBLIC_ORY_SDK_URL` and log a warning. The
middleware's `matcher` must cover every page that calls a function from
`@ory/nextjs/app`; the default `export const config = {}` does.

The middleware is meant for local development and preview deployments. It isn't
supported for production traffic: through the middleware, Ory sees every request
coming from your server instead of your users. In production, put Ory on the
same site as your application and set `NEXT_PUBLIC_ORY_SDK_URL` to that URL: a
[custom domain](https://www.ory.com/docs/guides/custom-domains) (CNAME) on Ory
Network, or your own domains on OEL.

```ts
// middleware.ts
import { createOryMiddleware } from "@ory/nextjs/middleware"
import oryConfig from "@/ory.config"

export const middleware = createOryMiddleware({
  ...oryConfig,
  trustedOrigins: [
    "http://localhost:3000",
    "https://my-app-*-my-team.vercel.app",
  ],
})

export const config = {}
```

Fetch or create a flow in an app router page and render it with Ory Elements:

```tsx
// app/auth/login/page.tsx
import { Login } from "@ory/elements-react/theme"
import "@ory/elements-react/theme/styles.css"
import { getLoginFlow, OryPageParams } from "@ory/nextjs/app"

import config from "@/ory.config"

export default async function LoginPage(props: OryPageParams) {
  const flow = await getLoginFlow(config, props.searchParams)

  if (!flow) {
    return null
  }

  return <Login flow={flow} config={config} />
}
```

`@/ory.config` exports the `OryClientConfiguration` object from
`@ory/elements-react`. The middleware and the flow functions read its `project`
property to find the route of each flow. The flow functions and `getError`
attach the URL the browser uses to reach Ory to what they return, so the
component uses the same URL as the server. `SessionProvider` fetches the session
itself: pass it `baseUrl={await getOryBaseUrl()}`.

### Which URL the browser uses

When Ory is on the same site as the application, the URL is
`NEXT_PUBLIC_ORY_SDK_URL`. Otherwise it is the page's origin when the middleware
handled the page and the origin is in `trustedOrigins`, and
`NEXT_PUBLIC_ORY_SDK_URL` if not. `getOryBaseUrl()` returns the same URL.

When the browser would call Ory on another site, Ory's session cookies don't
reach the application, and the package logs a warning once:

| Warning                                                                        | Fix                                                                                                                                                                                                  |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `The Ory proxy handled a request for <origin>, which is not in trustedOrigins` | In local development or a preview deployment, add the origin to `trustedOrigins`. In production, use a custom domain on the app's site.                                                              |
| `The app (<origin>) and Ory (<url>) are on different sites`                    | The middleware didn't run for this page. Export it from `proxy.ts` (`middleware.ts` before Next.js 16) in the project root, or in `src/` if the app uses one, and make its `matcher` cover the page. |
| `The request's Host header is not a valid origin`                              | Configure the reverse proxy in front of the application to forward the `Host` header the browser sent.                                                                                               |

The pages router hooks can't see the middleware: they use
`NEXT_PUBLIC_ORY_SDK_URL` when it is on the same site as the page, and the
page's origin otherwise.

| Entry point              | Exports                                                                                                                                                              |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@ory/nextjs/middleware` | `createOryMiddleware`                                                                                                                                                |
| `@ory/nextjs/app`        | `getLoginFlow`, `getRegistrationFlow`, `getRecoveryFlow`, `getVerificationFlow`, `getSettingsFlow`, `getLogoutFlow`, `getServerSession`, `getError`, `getOryBaseUrl` |
| `@ory/nextjs/pages`      | `useLoginFlow`, `useRegistrationFlow`, `useRecoveryFlow`, `useVerificationFlow`, `useSettingsFlow`, `useLogoutFlow`, `useError`                                      |

Check the
[app router](https://github.com/ory/elements/blob/main/examples/nextjs-app-router/middleware.ts)
and
[page router](https://github.com/ory/elements/blob/main/examples/nextjs-pages-router/middleware.ts)
middleware example for more details.

## Coding agents

The package ships documentation for coding agents that matches the installed
version:

- `node_modules/@ory/nextjs/agents/GUIDE.md`: an integration guide.
- `node_modules/@ory/nextjs/skills/add-ory-auth-to-nextjs/SKILL.md`: a skill
  that adds the flows to a Next.js application.

Agents don't look into `node_modules` unless something points them there. Paste
this line into your project's `AGENTS.md`, `CLAUDE.md`, or the file your agent
reads:

```md
- Ory for Next.js (`@ory/nextjs`, not `@ory/integrations`): read
  `node_modules/@ory/nextjs/agents/GUIDE.md` before changing authentication
  code.
```

## Learn by example

See the [examples](https://github.com/ory/elements/blob/main/examples) directory
for examples on how to use the package.

## Development

This package is built using Nx.

### Building

Run `nx build @ory/nextjs` to build the library.

### Developing

Run `nx dev @ory/nextjs` to watch the source code for changes and continuously
build the library.

### Running unit tests

Run `nx test @ory/nextjs` to execute the unit tests via
[Jest](https://jestjs.io).
