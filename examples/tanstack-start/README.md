# Ory Elements with TanStack Start

This example renders all Ory Elements browser flows through TanStack Start
server functions and installs the Fetch-native Ory proxy as request middleware.
It has the same flow coverage as the Next.js App Router example and shows the
current Ory session on the home page.

## Run it with an Ory project

Create or select an Ory Network project, then start the example with its public
SDK URL. The project API token is only required when the proxy must rewrite Ory
base URLs in JSON responses.

```sh
export ORY_SDK_URL=https://your-project.projects.oryapis.com
export ORY_PROJECT_API_TOKEN=your-project-api-token
pnpm nx dev tanstack-start-example
```

Open <http://localhost:3000>. Keep `ORY_PROJECT_API_TOKEN` server-only.

Optional server-only variables are `ORY_SERVER_SDK_URL` for a private Ory
upstream and `APP_URL` for the canonical public application URL.

For local development, configure these UI URLs in the Ory project:

- Login: `http://localhost:3000/auth/login`
- Registration: `http://localhost:3000/auth/registration`
- Recovery: `http://localhost:3000/auth/recovery`
- Verification: `http://localhost:3000/auth/verification`
- Error: `http://localhost:3000/auth/error`
- Settings: `http://localhost:3000/settings`
- Post-logout redirect: `http://localhost:3000/`

The example creates the logout flow only after confirming that a session is
active. It intentionally does not send a per-request `return_to`; Ory requires
every such URL to be present in the project's allowed return URLs. The proxy
maps Ory's default `/ui/welcome` redirect to the configured
`default_redirect_url` instead. If an application passes `returnTo` to
`getLogoutFlow`, add that exact URL to the Ory project's allowlist.

The individual screens do not need separate code paths for every authentication
method. Ory supplies password, code, social/OIDC, passkey, MFA, and CAPTCHA
nodes in the flow; Elements renders the nodes enabled in the project.

## Manual verification checklist

- Register, sign in, refresh the home page, open settings, and sign out.
- Exercise password and code flows enabled for the project.
- Exercise each configured social/OIDC provider.
- Register and use a passkey/WebAuthn credential on a secure origin.
- Enroll and challenge TOTP, lookup-secret, or other enabled MFA methods.
- Complete account recovery and verification through the configured email or SMS
  provider.
- Confirm CAPTCHA appears and validates when it is enabled for a flow.
- Confirm cookies survive navigation and that the authenticated home page shows
  the identity email, username, phone, or ID.

Email/SMS delivery, OIDC providers, WebAuthn origins, MFA, and CAPTCHA are Ory
project settings; they cannot be fully exercised with the repository's mocked
unit tests.

## Implementation notes

Each flow keeps its `createServerFn` wrapper in application source so the
TanStack compiler can transform it. The reusable package handles flow loading,
cookies, redirects, session/error/logout calls, and cross-site proxying.

The example uses TanStack Start's stable Rsbuild integration and stable `srvx`
server. This avoids the prerelease Nitro dependency required by TanStack's Vite
example. The `@ory/tanstack-start` package itself is build-tool independent and
uses standard Fetch requests and responses.
