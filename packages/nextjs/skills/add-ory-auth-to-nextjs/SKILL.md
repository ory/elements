---
name: add-ory-auth-to-nextjs
description:
  Add Ory login, registration, account recovery, email verification, account
  settings, logout, and session checks to a Next.js app with @ory/nextjs and
  @ory/elements-react. Use when asked to add authentication, a login or sign-up
  page, or protected routes backed by Ory to a Next.js project, or to fix an Ory
  integration that shows a blank page, a CSRF error, or a 404 after a redirect.
  Not for @ory/integrations or the legacy @ory/elements package.
---

# Add Ory authentication to a Next.js app

This skill ships inside `@ory/nextjs` and matches the installed version. The
reference for every API used here is `node_modules/@ory/nextjs/agents/GUIDE.md`.

Do not run `ory tunnel` or `ory proxy`, and do not install `@ory/integrations`
or `@ory/elements`. Guides that use them describe an older integration. In local
development and preview deployments, the middleware from this package replaces
all of them.

## 1. Inspect the project

1. Find the router: an `app/` directory is the app router, a `pages/` directory
   is the pages router. This skill shows the app router. For the pages router,
   use the hooks from `@ory/nextjs/pages` as shown in the guide.
2. Check whether the project uses a `src/` directory. If it does, every path
   below, including `middleware.ts`, goes inside `src/`.
3. Check that the `@/*` import alias in `tsconfig.json` points at the directory
   that will hold `ory.config.ts`. If the project has no alias, use relative
   imports.
4. Search for `@ory/integrations`, `@ory/elements"`, `ory tunnel`, and
   `localhost:4000`. Remove what you find as part of this change, and tell the
   user.

## 2. Install and set the SDK URL

```sh
npm install @ory/nextjs @ory/elements-react
```

Use the project's package manager. Then set the URL of the Ory APIs and an
[API key](https://www.ory.com/docs/concepts/personal-access-token) of the Ory
project. Ask the user for both if you don't have them. Don't invent a project
slug, and don't create an API key.

```sh
# .env.local
NEXT_PUBLIC_ORY_SDK_URL=https://<project-slug>.projects.oryapis.com
ORY_PROJECT_API_TOKEN=<api-key>
```

Without `ORY_PROJECT_API_TOKEN`, password login works, but email links point to
the Ory project URL and social sign-in and SAML don't return to the application.
If the user can't provide the key yet, finish the setup and list it as a missing
step in your summary. The key is a secret: never prefix it with `NEXT_PUBLIC_`
and make sure `.env.local` is in `.gitignore`.

## 3. Add the configuration and the middleware

```ts
// ory.config.ts
import type { OryClientConfiguration } from "@ory/elements-react"

const config: OryClientConfiguration = {
  project: {
    name: "My application",
    default_redirect_url: "/",
    error_ui_url: "/auth/error",
    login_ui_url: "/auth/login",
    registration_ui_url: "/auth/registration",
    recovery_ui_url: "/auth/recovery",
    verification_ui_url: "/auth/verification",
    settings_ui_url: "/settings",
    registration_enabled: true,
    recovery_enabled: true,
    verification_enabled: true,
  },
}

export default config
```

```ts
// middleware.ts
import { createOryMiddleware } from "@ory/nextjs/middleware"

import oryConfig from "@/ory.config"

export const middleware = createOryMiddleware({
  ...oryConfig,
  trustedOrigins: ["http://localhost:3000"],
})

export const config = {}
```

The middleware is meant for local development and preview deployments. If the
project deploys previews, add a `RegExp` for their origins to `trustedOrigins`,
anchored to the project and team. Production use of the middleware is
discouraged, so don't add the production origin and don't present the middleware
as the production setup. In production, the application needs an Ory custom
domain on its own site, with `NEXT_PUBLIC_ORY_SDK_URL` set to that domain. Say
so in your summary to the user. If the project already has a `middleware.ts`,
keep its logic and return the Ory middleware's response at the end. The Ory
middleware passes every request that is not for an Ory API through unchanged.

```ts
// reference/combined-middleware.ts
import { createOryMiddleware } from "@ory/nextjs/middleware"
import { NextResponse, type NextRequest } from "next/server"

import oryConfig from "@/ory.config"

const ory = createOryMiddleware({
  ...oryConfig,
  trustedOrigins: ["http://localhost:3000"],
})

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/old-path") {
    return NextResponse.redirect(new URL("/new-path", request.url))
  }

  return ory(request)
}
```

## 4. Add the flow pages

Add the stylesheet once in a layout for the flow pages:

```tsx
// app/auth/layout.tsx
import "@ory/elements-react/theme/styles.css"
import type { PropsWithChildren } from "react"

export default function AuthLayout({ children }: PropsWithChildren) {
  return <main>{children}</main>
}
```

Create one page for each `*_ui_url` in `ory.config.ts`. The route has to match
the URL exactly.

```tsx
// app/auth/login/page.tsx
import { Login } from "@ory/elements-react/theme"
import { getLoginFlow, type OryPageParams } from "@ory/nextjs/app"

import config from "@/ory.config"

export default async function LoginPage(props: OryPageParams) {
  const flow = await getLoginFlow(config, props.searchParams)

  if (!flow) {
    return null
  }

  return <Login flow={flow} config={config} />
}
```

```tsx
// app/auth/registration/page.tsx
import { Registration } from "@ory/elements-react/theme"
import { getRegistrationFlow, type OryPageParams } from "@ory/nextjs/app"

import config from "@/ory.config"

export default async function RegistrationPage(props: OryPageParams) {
  const flow = await getRegistrationFlow(config, props.searchParams)

  if (!flow) {
    return null
  }

  return <Registration flow={flow} config={config} />
}
```

```tsx
// app/auth/recovery/page.tsx
import { Recovery } from "@ory/elements-react/theme"
import { getRecoveryFlow, type OryPageParams } from "@ory/nextjs/app"

import config from "@/ory.config"

export default async function RecoveryPage(props: OryPageParams) {
  const flow = await getRecoveryFlow(config, props.searchParams)

  if (!flow) {
    return null
  }

  return <Recovery flow={flow} config={config} />
}
```

```tsx
// app/auth/verification/page.tsx
import { Verification } from "@ory/elements-react/theme"
import { getVerificationFlow, type OryPageParams } from "@ory/nextjs/app"

import config from "@/ory.config"

export default async function VerificationPage(props: OryPageParams) {
  const flow = await getVerificationFlow(config, props.searchParams)

  if (!flow) {
    return null
  }

  return <Verification flow={flow} config={config} />
}
```

```tsx
// app/settings/page.tsx
import { SessionProvider } from "@ory/elements-react/client"
import { Settings } from "@ory/elements-react/theme"
import "@ory/elements-react/theme/styles.css"
import { getSettingsFlow, type OryPageParams } from "@ory/nextjs/app"

import config from "@/ory.config"

export default async function SettingsPage(props: OryPageParams) {
  const flow = await getSettingsFlow(config, props.searchParams)

  if (!flow) {
    return null
  }

  return (
    <SessionProvider>
      <Settings flow={flow} config={config} />
    </SessionProvider>
  )
}
```

Do not skip the error page. Ory redirects to it when a flow fails.

```tsx
// app/auth/error/page.tsx
import { Error as ErrorCard } from "@ory/elements-react/theme"
import { getError, getServerSession, type OryPageParams } from "@ory/nextjs/app"

import config from "@/ory.config"

export default async function ErrorPage(props: OryPageParams) {
  const error = await getError(props.searchParams)
  const session = await getServerSession()

  return (
    <ErrorCard error={error} config={config} session={session ?? undefined} />
  )
}
```

## 5. Protect pages and add logout

The middleware does not protect routes. Check the session where the page
renders:

```tsx
// app/dashboard/page.tsx
import { getLogoutFlow, getServerSession } from "@ory/nextjs/app"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth/login")
  }

  const logout = await getLogoutFlow({ returnTo: "/" })

  return <a href={logout.logout_url}>Sign out</a>
}
```

## 6. Verify before you report success

A page that renders is not proof. Run every step:

1. Type check: `npx tsc --noEmit`.
2. Start the application, then request a flow through the middleware:

   ```sh
   curl -i -H "Accept: application/json" http://localhost:3000/self-service/login/browser
   ```

   Expect a JSON flow and a `Set-Cookie` header. A 404 means `middleware.ts` is
   in the wrong directory. An error that starts with `[@ory/nextjs]` in the
   server output names the fix.

3. Request `/auth/login`, `/auth/registration`, `/auth/recovery`,
   `/auth/verification`, and `/auth/error`. None of them is a 404. `/settings`
   redirects to the login page while signed out.
4. If you can drive a browser, register a user at `/auth/registration` with a
   long random password, then sign in at `/auth/login` and load the protected
   page. If you cannot, say so and list this step as not verified.

## When something is wrong

| Symptom                                                   | Cause and fix                                                                                                         |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| An error about `trustedOrigins` at startup                | Add `trustedOrigins` to `createOryMiddleware`.                                                                        |
| `The Ory SDK URL is not set`                              | Set `NEXT_PUBLIC_ORY_SDK_URL` and restart the dev server.                                                             |
| Email links or social sign-in land on the Ory project URL | Set `ORY_PROJECT_API_TOKEN` and restart the dev server.                                                               |
| Blank flow page                                           | The page returned `null` for a missing flow. Read the `[@ory/nextjs]` warning in the server output.                   |
| 404 after submitting a form or following a link           | A `*_ui_url` in `ory.config.ts` has no page at that route.                                                            |
| CSRF error on submit                                      | The browser talks to Ory on another site. Remove `ory tunnel`, `localhost:4000`, and custom `FrontendApi` base paths. |
| Unstyled forms                                            | `@ory/elements-react/theme/styles.css` is not imported.                                                               |
