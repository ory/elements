# @ory/ssr

Framework-neutral server-side helpers for Ory Elements. This package is meant
for authors of framework adapters such as `@ory/nextjs`. Apps should use the
adapter for their framework instead.

The helpers take a standard `Request`, or any `{ url, headers }` object, and
return data or a URL to redirect to. They never throw framework redirects and
never read environment variables. The adapter reads its configuration and turns
a redirect target into the framework's redirect.

## `@ory/ssr`

Fetches what a server-rendered page needs from Ory and forwards the request's
cookies:

- `getFlow` returns `{ flow }` or `{ redirectTo }` for the login, registration,
  recovery, verification, and settings flows.
- `getSession`, `createLogoutFlow`, and `getError` return the session, a logout
  flow, and the error for an error page.
- `resolveFlow` and `resolveError` take a function that fetches from Ory, for
  adapters that bring their own SDK client.
- `resolveOryBaseUrl` decides which URL the browser uses to reach Ory, and
  `oryBaseUrlWarning` explains a result that does not work.

Flows and errors carry the URL the browser uses to reach Ory as `ory_base_url`.
Ory Elements components read it, so pages pass the flow without a `baseUrl`
prop.

```ts
import { FlowType, LoginFlow } from "@ory/client-fetch"
import { getFlow, requestOrigin, resolveOryBaseUrl } from "@ory/ssr"

const sdkUrl = "https://<slug>.projects.oryapis.com"
const { url: baseUrl } = resolveOryBaseUrl({
  sdkUrl,
  origin: requestOrigin(request),
  proxy: "absent",
})
const result = await getFlow<LoginFlow>(FlowType.Login, request, {
  sdkUrl,
  route: "/login",
  baseUrl,
})
if ("redirectTo" in result) {
  // Redirect the browser with your framework.
}
```

### Which URL the browser uses

`resolveOryBaseUrl` takes the SDK URL, the request's origin, and what the Ory
proxy reported for the request (`trusted-origin`, `untrusted-origin`, or
`absent`). The first matching rule wins:

| Condition                                       | URL     | `reason`                 |
| ----------------------------------------------- | ------- | ------------------------ |
| The origin is not a valid origin                | SDK URL | `invalid-origin`         |
| The app and Ory are on the same site            | SDK URL | `same-site`              |
| The proxy handled the request, origin trusted   | origin  | `proxy`                  |
| The proxy handled the request, origin untrusted | SDK URL | `proxy-untrusted-origin` |
| Otherwise                                       | SDK URL | `cross-site-no-proxy`    |

An adapter's proxy reports `trusted-origin` only for an origin that matches
`trustedOrigins`. Adapters log `oryBaseUrlWarning` once per reason, with their
package name as the prefix.

## `@ory/ssr/proxy`

`handleOryProxy` proxies requests for Ory paths, such as `/self-service/*`, to
Ory so the browser talks to the app's origin and Ory's cookies are first-party.
It returns `null` for every other path, so the framework handles the request.

```ts
import { handleOryProxy } from "@ory/ssr/proxy"

const response = await handleOryProxy(request, {
  sdkUrl: "https://<slug>.projects.oryapis.com",
  trustedOrigins: ["http://localhost:3000"],
})
```

`trustedOrigins` lists the origins the deployment serves. The proxy signs its
own origin as Ory's base URL only for a valid origin that matches an entry. An
entry is an origin without a path. To match several origins, use `*` in the host
as a glob, such as `https://my-app-*-my-team.vercel.app`. Each `*` matches one
or more letters, digits, or hyphens and never a dot, and it can't make up the
whole label right before a public suffix from the
[Public Suffix List](https://publicsuffix.org/), such as `vercel.app` or `com`.
An invalid entry throws.

The proxy is for local development and preview deployments. Through the proxy,
Ory sees every request coming from the app server instead of the user's browser.
In production, serve Ory on a custom domain (CNAME) of your Ory Network project,
or on your own domains when you self-host with the Ory Enterprise License.
