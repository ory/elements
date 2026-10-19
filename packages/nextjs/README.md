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

This package includes a middleware for the app and page router that enables
local development and preview environments to work with
[Ory's cookie security model](https://www.ory.com/docs/security-model). The
middleware serves the Ory APIs on your application's own origin.

> [!WARNING]  
> Don't run Ory Tunnel and don't set the SDK URL to `http://localhost:4000` when
> you use the `@ory/nextjs` middleware. Guides that tell you to start
> `ory tunnel` for local development describe integrations without this package.
> Set `NEXT_PUBLIC_ORY_SDK_URL` to your Ory Network project URL instead.

## Installation

Run `npm install @ory/nextjs` or `yarn add @ory/nextjs` to install the package.
To render the flows, also install
[`@ory/elements-react`](https://www.npmjs.com/package/@ory/elements-react).

## Configuration

This middleware expects environment variable `NEXT_PUBLIC_ORY_SDK_URL` to be set
to your Ory Network Project SDK URL. This is the URL that you would use to
access the Ory API. If you have a custom domain for your Ory Network Project,
you should use the custom domain for `NEXT_PUBLIC_ORY_SDK_URL`. `ORY_SDK_URL` is
read as a fallback.

Set `ORY_PROJECT_API_TOKEN` to an
[API key](https://www.ory.com/docs/concepts/personal-access-token) of your Ory
project. The middleware sends it so that Ory accepts your application's origin
as the base URL. Without it, links in recovery and verification emails point to
the Ory project URL, and social sign-in and SAML don't return to your
application. Keep the key server-side: don't prefix it with `NEXT_PUBLIC_`.

## Usage

Create the middleware. `trustedOrigins` is required: `createOryMiddleware`
throws when it is unset or empty. List the local development origin and a
`RegExp` for your preview deployments, anchored to your project and team.

The middleware is meant for local development and preview deployments. Using it
for production traffic is discouraged. In production, give your Ory project a
[custom domain](https://www.ory.com/docs/guides/custom-domains) on the same site
as your application and set `NEXT_PUBLIC_ORY_SDK_URL` to it.

```ts
// middleware.ts
import { createOryMiddleware } from "@ory/nextjs/middleware"
import oryConfig from "@/ory.config"

export const middleware = createOryMiddleware({
  ...oryConfig,
  trustedOrigins: [
    "http://localhost:3000",
    /^https:\/\/my-app-[a-z0-9-]+-my-team\.vercel\.app$/,
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
property to find the route of each flow.

| Entry point              | Exports                                                                                                                                             |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@ory/nextjs/middleware` | `createOryMiddleware`                                                                                                                               |
| `@ory/nextjs/app`        | `getLoginFlow`, `getRegistrationFlow`, `getRecoveryFlow`, `getVerificationFlow`, `getSettingsFlow`, `getLogoutFlow`, `getServerSession`, `getError` |
| `@ory/nextjs/pages`      | `useLoginFlow`, `useRegistrationFlow`, `useRecoveryFlow`, `useVerificationFlow`, `useSettingsFlow`, `useLogoutFlow`, `useError`                     |

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
