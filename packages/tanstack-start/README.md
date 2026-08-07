# `@ory/tanstack-start`

Server helpers and request middleware for rendering
[`@ory/elements-react`](../elements-react) in a TanStack Start application.

The React components are framework-independent. This package supplies the
TanStack Start-specific pieces: server-side flow loading, TanStack redirects,
session and error helpers, and a same-origin Ory proxy for cross-site
development and preview deployments.

## Installation

```sh
npm install @ory/tanstack-start @ory/elements-react
```

Set `ORY_SDK_URL` to the public SDK URL of your Ory Network project. Keep
project API tokens server-only.

## Configure the server client

Create the Ory client in a server-only module:

```ts
import { createOry } from "@ory/tanstack-start/server"
import config from "./ory.config"

export const ory = createOry({
  sdkUrl: process.env.ORY_SDK_URL!,
  serverSdkUrl: process.env.ORY_SERVER_SDK_URL,
  appUrl: process.env.APP_URL,
  project: config.project,
})
```

The client exposes `getLoginFlow`, `getRegistrationFlow`, `getRecoveryFlow`,
`getVerificationFlow`, `getSettingsFlow`, `getLogoutFlow`, `getSession`, and
`getError`.

The package is ESM-only, matching TanStack Start's runtime exports.

The peer dependency floor is TanStack Router `1.170.0` and TanStack Start
`1.168.0`, the oldest release set this package's build and tests are verified
against. The example is pinned to Router `1.170.18` and Start `1.168.32`, a
release set that had soak time before adoption.

TanStack transforms `createServerFn` in application source, so keep that wrapper
in the application and call the package's portable server helper from its
handler:

```ts
import type { QueryParams } from "@ory/tanstack-start"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { ory } from "./ory.server"

export const loadLoginFlow = createServerFn({ method: "GET" })
  .inputValidator((params: QueryParams) => params)
  .handler(async ({ data: params }) => {
    const request = getRequest()
    return {
      flow: await ory.getLoginFlow({ request, params }),
      sdkUrl: ory.getBrowserSdkUrl({ request }),
    }
  })
```

Pass the returned browser URL to Elements. It is the Ory SDK URL for same-site
custom domains and the application origin when proxying is required:

```tsx
<Login
  flow={flow}
  config={{ ...config, sdk: { url: sdkUrl } }}
  components={{ Card: {} }}
/>
```

## Install the proxy middleware

Adding `src/start.ts` disables TanStack Start's automatic CSRF middleware.
Install both middlewares explicitly:

```ts
import { createOryMiddleware } from "@ory/tanstack-start/middleware"
import { createCsrfMiddleware, createStart } from "@tanstack/react-start"
import config from "./ory.config"

export const startInstance = createStart(() => ({
  requestMiddleware: [
    createOryMiddleware({
      sdkUrl: process.env.ORY_SDK_URL!,
      serverSdkUrl: process.env.ORY_SERVER_SDK_URL,
      appUrl: process.env.APP_URL,
      project: config.project,
      projectApiToken: process.env.ORY_PROJECT_API_TOKEN,
    }),
    createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === "serverFn" }),
  ],
}))
```

Place the Ory middleware before application authentication gates. It handles
Ory's public `/self-service`, `/sessions/whoami`, `/ui`, `/.ory`, and
`/.well-known/ory` paths, including request headers, cookie domains, redirect
locations, and URLs embedded in response bodies.

For deployments where `request.url` is not browser-facing, set `appUrl` to the
canonical public application URL. Do not derive it from untrusted forwarded
headers.

If your runtime reaches Ory over a private or internal address, set
`serverSdkUrl` while keeping `sdkUrl` equal to the public browser URL. The
private address is used only for server SDK calls and proxy upstream requests.
`projectApiToken` is also server-only and is never returned to the browser.

## Authentication gates

TanStack invokes client-side route loaders through `/_serverFn/<id>`. A global
pathname-only authentication gate cannot tell a public auth loader from a
protected server function. Keep auth flow server functions public and enforce
authorization on protected routes/functions; do not blindly allow every
`/_serverFn` request.

## Example

See [`examples/tanstack-start`](../../examples/tanstack-start) for a runnable
Rsbuild application.

## Development

```sh
nx build @ory/tanstack-start
nx test @ory/tanstack-start
```
