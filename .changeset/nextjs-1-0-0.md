---
"@ory/nextjs": major
---

First stable release. Changes since 1.0.0-rc.1:

- **Breaking:** `createOryMiddleware` requires `trustedOrigins`, the exact origins or RegExp patterns the deployment serves, and throws at startup when it is unset or empty. The request origin is sent to Ory as the base URL for redirects and emails only when it matches the list.
- **Breaking:** Requires `react` 18.2 or later.
- Built on `@ory/ssr`, which fetches flows and sessions from a standard `Request`. The proxy uses web-standard APIs instead of `Buffer`.
- The middleware forwards the browser's `Origin` and `Sec-Fetch-*` headers to Ory.
- Settings flows restart when the session is missing or expired, sending users through sign-in and keeping `return_to`.
- Preview deployments on a custom domain that is same-site with the Ory URL talk to Ory directly instead of through the proxy.
- Ships version-matched agent guides in `agents/`.
