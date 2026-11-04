---
"@ory/nextjs": major
---

First stable release. Changes since 1.0.0-rc.1.

**Breaking changes**

- **`trustedOrigins` is required.** `createOryMiddleware` throws at startup when `trustedOrigins` is unset or empty. Ory uses the request origin as the base URL for redirects and for links in emails only when it matches an entry, which is an exact origin or a `*` glob:

  ```ts
  import { createOryMiddleware } from "@ory/nextjs/middleware"

  export default createOryMiddleware({
    trustedOrigins: [
      "http://localhost:3000",
      "https://my-app-*-my-team.vercel.app",
    ],
  })
  ```

  See [Trusted origins](https://www.ory.com/docs/elements/guides/configuration#trusted-origins) and the [`createOryMiddleware` reference](https://www.ory.com/docs/elements/reference/@ory/nextjs/middleware/functions/createOryMiddleware).

- **React 18.2 or later.** Earlier React versions are no longer supported.

**Changes**

- Built on `@ory/ssr`, which fetches flows and sessions from a standard `Request`. The proxy uses web-standard APIs instead of `Buffer`. See the [Next.js App Router quickstart](https://www.ory.com/docs/getting-started/integrate-auth/nextjs-app-router-quickstart).
- The middleware forwards the browser's `Origin` and `Sec-Fetch-*` headers to Ory.
- A settings flow restarts when the session is missing or expired. The user signs in again and returns to the settings page through `return_to`.
- Preview deployments on a custom domain that is on the same site as the Ory URL call Ory directly instead of through the proxy.
- The package ships version-matched guides for coding agents in `agents/`.

### Patch Changes

- Updated dependencies [ed75f51]
- @ory/ssr@1.0.0
